const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lbvqmerzhfrmuepfsoqb.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_AvmFxTdvPeuCxI241_hrjA_fYvM3bcs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const migrations = [
  // 1. 创建用户表
  `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    monthly_minutes INTEGER DEFAULT 30,
    used_minutes DECIMAL(10,2) DEFAULT 0,
    storage_used_mb DECIMAL(10,2) DEFAULT 0,
    storage_limit_mb INTEGER DEFAULT 1024,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    subscription_current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  `,
  
  // 2. 创建用量记录表
  `
  CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    minutes_used DECIMAL(10,2) DEFAULT 0,
    file_size_mb DECIMAL(10,2) DEFAULT 0,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );
  `,
  
  // 3. 创建支付记录表
  `
  CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'hkd',
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  `,
  
  // 4. 创建文件表
  `
  CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500),
    size_mb DECIMAL(10,2) NOT NULL,
    mime_type VARCHAR(100),
    storage_path VARCHAR(1000),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
  );
  `,
  
  // 5. 创建订阅计划表
  `
  CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    monthly_minutes INTEGER,
    storage_limit_mb INTEGER,
    features JSONB,
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
  );
  `,
  
  // 6. 插入默认计划
  `
  INSERT INTO plans (name, display_name, price_monthly, price_yearly, monthly_minutes, storage_limit_mb, features)
  VALUES 
    ('free', 'Free Plan', 0, 0, 30, 1024, '["30 minutes/month", "1GB storage", "Basic OCR"]'),
    ('basic', 'Basic Plan', 78, 780, 90, 10240, '["90 minutes/month", "10GB storage", "AI OCR", "Priority support"]'),
    ('pro', 'Pro Plan', 118, 1180, 180, 51200, '["180 minutes/month", "50GB storage", "AI OCR", "API access", "Priority support"]'),
    ('premium', 'Premium Plan', 312, 3120, 600, 102400, '["600 minutes/month", "100GB storage", "AI OCR", "API access", "Dedicated support", "Custom integration"]')
  ON CONFLICT (name) DO NOTHING;
  `
];

async function migrate() {
  console.log('🔄 正在创建数据库表...\n');
  
  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    const tableName = migration.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || `Step ${i + 1}`;
    console.log(`${i + 1}/${migrations.length} 创建 ${tableName}...`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: migration });
      
      if (error) {
        // 如果 exec_sql 函数不存在，尝试直接查询
        const { error: queryError } = await supabase.from('_temp_query').select('*').limit(1);
        
        // 使用 REST API 直接执行 SQL
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({ query: migration })
        });
        
        if (!response.ok) {
          console.log(`   ⚠️  ${tableName} 可能需要手动在 SQL Editor 中创建`);
          console.log(`   SQL: ${migration.substring(0, 100)}...`);
        } else {
          console.log(`   ✅ ${tableName} 创建成功`);
        }
      } else {
        console.log(`   ✅ ${tableName} 创建成功`);
      }
    } catch (err) {
      console.log(`   ⚠️ ${tableName}: ${err.message}`);
    }
  }
  
  console.log('\n✨ 迁移完成！');
  console.log('\n💡 如果自动创建失败，请手动复制以下 SQL 到 Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/lbvqmerzhfrmuepfsoqb/sql/new');
  console.log('\n' + '='.repeat(50));
  console.log(migrations.join('\n'));
}

migrate();
