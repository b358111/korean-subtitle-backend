# CantoSub Backend 部署检查清单

## 部署前准备

### ✅ 1. 确认文件完整

确保以下文件都存在：

```
backend/
├── package.json ✅
├── railway.json ✅
├── README.md ✅
├── .gitignore ✅
└── src/
    ├── index.js ✅
    ├── db/
    │   ├── index.js ✅
    │   └── migrate.js ✅
    ├── middleware/
    │   └── auth.js ✅
    └── routes/
        ├── auth.js ✅
        ├── ocr.js ✅
        ├── files.js ✅
        ├── payments.js ✅
        ├── usage.js ✅
        └── admin.js ✅
```

### ✅ 2. 准备环境变量

你需要以下信息：

| 变量 | 来源 | 状态 |
|------|------|------|
| SUPABASE_URL | Supabase 项目设置 → API | ⬜ |
| SUPABASE_ANON_KEY | Supabase 项目设置 → API | ⬜ |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 项目设置 → API | ⬜ |
| JWT_SECRET | 自己生成随机字符串 | ⬜ |
| KIMI_API_KEY | Kimi 开放平台 | ⬜ |
| STRIPE_SECRET_KEY | Stripe 控制台 | ⬜ |
| FRONTEND_URL | 你的前端网站地址 | ⬜ |

### ✅ 3. 数据库表已创建

在 Supabase SQL 编辑器中执行以下 SQL：

```sql
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  plan_type VARCHAR(50) DEFAULT 'free',
  credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用量记录表
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  credits_used INTEGER DEFAULT 0,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 支付记录表
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR(255),
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'usd',
  status VARCHAR(50) DEFAULT 'pending',
  credits_added INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文件记录表
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_name VARCHAR(500),
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  result_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 套餐表
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  stripe_price_id VARCHAR(255),
  price INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 部署步骤

### 方法 A：通过 GitHub 部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **在 Railway 中连接 GitHub 仓库**
   - 进入 Railway 项目
   - Settings → Source
   - 选择你的 GitHub 仓库

3. **设置环境变量**
   - Variables → New Variable
   - 添加所有必需的环境变量

4. **部署**
   - 点击 Deploy 按钮

### 方法 B：通过 Railway CLI 部署

1. **安装 CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **登录**
   ```bash
   railway login
   ```

3. **关联项目**
   ```bash
   railway link
   ```

4. **设置环境变量**
   ```bash
   railway variables set KEY="value"
   ```

5. **部署**
   ```bash
   railway up
   ```

---

## 部署后验证

### 1. 健康检查

```bash
curl https://your-app.up.railway.app/health
```

预期返回：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 测试 API

```bash
# 测试注册
curl -X POST https://your-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 测试登录
curl -X POST https://your-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. 检查日志

在 Railway 控制台查看日志，确认没有错误。

---

## 常见问题排查

### ❌ 构建失败

**错误：** `Build failed`

**解决：**
1. 检查 `package.json` 是否存在
2. 检查 `railway.json` 配置
3. 查看详细构建日志

### ❌ 数据库连接失败

**错误：** `Connection refused` 或 `timeout`

**解决：**
1. 检查 Supabase URL 是否正确
2. 检查 Supabase Key 是否有效
3. 确保 Supabase 项目处于活动状态

### ❌ CORS 错误

**错误：** `CORS policy: No 'Access-Control-Allow-Origin'`

**解决：**
1. 检查 `FRONTEND_URL` 环境变量
2. 确保 URL 包含 `https://`
3. 确保没有尾部斜杠

### ❌ JWT 验证失败

**错误：** `Invalid token` 或 `Unauthorized`

**解决：**
1. 检查 `JWT_SECRET` 是否设置
2. 确保前后端使用相同的密钥
3. 检查 token 是否过期

---

## 下一步

部署成功后，你需要：

1. ✅ 更新前端代码中的 API 地址
2. ✅ 配置 Stripe Webhook 地址
3. ✅ 测试完整的用户流程
4. ✅ 设置监控和告警
