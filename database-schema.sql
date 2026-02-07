-- CantoSub AI 数据库结构
-- 复制以下所有 SQL 到 Supabase SQL Editor 执行

-- 1. 用户表
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

-- 2. 用量记录表
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  minutes_used DECIMAL(10,2) DEFAULT 0,
  file_size_mb DECIMAL(10,2) DEFAULT 0,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 支付记录表
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

-- 4. 文件表
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

-- 5. 订阅计划表
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

-- 6. 插入默认计划
INSERT INTO plans (name, display_name, price_monthly, price_yearly, monthly_minutes, storage_limit_mb, features)
VALUES 
  ('free', 'Free Plan', 0, 0, 30, 1024, '["30 minutes/month", "1GB storage", "Basic OCR"]'::jsonb),
  ('basic', 'Basic Plan', 78, 780, 90, 10240, '["90 minutes/month", "10GB storage", "AI OCR", "Priority support"]'::jsonb),
  ('pro', 'Pro Plan', 118, 1180, 180, 51200, '["180 minutes/month", "50GB storage", "AI OCR", "API access", "Priority support"]'::jsonb),
  ('premium', 'Premium Plan', 312, 3120, 600, 102400, '["600 minutes/month", "100GB storage", "AI OCR", "API access", "Dedicated support", "Custom integration"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- 成功消息
SELECT 'Database tables created successfully!' as message;
