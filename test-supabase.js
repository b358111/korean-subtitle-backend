const { createClient } = require('@supabase/supabase-js');

// 你的 Supabase 配置
const SUPABASE_URL = 'https://lbvqmerzhfrmuepfsoqb.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_AvmFxTdvPeuCxI241_hrjA_fYvM3bcs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testConnection() {
  console.log('🔄 正在测试 Supabase 连接...\n');

  try {
    // 测试 1: 检查连接
    console.log('1️⃣ 测试数据库连接...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError && testError.code === 'PGRST116') {
      console.log('   ⚠️  users 表不存在，需要运行数据库迁移');
    } else if (testError) {
      console.log('   ❌ 连接失败:', testError.message);
      return;
    } else {
      console.log('   ✅ 数据库连接成功！');
    }

    // 测试 2: 创建测试用户
    console.log('\n2️⃣ 测试创建用户...');
    const testEmail = `test_${Date.now()}@example.com`;
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        email: testEmail,
        name: 'Test User',
        plan: 'free',
        monthly_minutes: 30,
        storage_limit_mb: 1024
      }])
      .select()
      .single();

    if (createError) {
      console.log('   ❌ 创建用户失败:', createError.message);
      if (createError.code === '42P01') {
        console.log('   💡 提示: 数据库表不存在，请先运行迁移脚本');
      }
    } else {
      console.log('   ✅ 测试用户创建成功！');
      console.log('   📧 用户邮箱:', newUser.email);
      console.log('   🆔 用户ID:', newUser.id);

      // 测试 3: 查询用户
      console.log('\n3️⃣ 测试查询用户...');
      const { data: user, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('id', newUser.id)
        .single();

      if (queryError) {
        console.log('   ❌ 查询失败:', queryError.message);
      } else {
        console.log('   ✅ 查询成功！');
        console.log('   👤 用户名:', user.name);
        console.log('   📅 创建时间:', user.created_at);
      }

      // 测试 4: 删除测试用户
      console.log('\n4️⃣ 清理测试数据...');
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', newUser.id);

      if (deleteError) {
        console.log('   ⚠️ 删除失败:', deleteError.message);
      } else {
        console.log('   ✅ 测试数据已清理');
      }
    }

    console.log('\n✨ 测试完成！');

  } catch (err) {
    console.error('\n❌ 测试出错:', err.message);
  }
}

testConnection();
