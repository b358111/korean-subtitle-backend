# CantoSub AI - 完整部署指南

## 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                          前端 (Vercel)                           │
│                     React + Tailwind CSS                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────────┐
│                        后端 (Railway)                            │
│              Node.js + Express + Supabase                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Auth API   │  │  OCR API    │  │  Payment API (Stripe)   │ │
│  │  (JWT)      │  │  (Kimi)     │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Usage API  │  │  File API   │  │  Admin API              │ │
│  │  (追踪)     │  │  (R2/S3)    │  │  (管理后台)              │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    ▼                       ▼                       ▼
┌──────────┐          ┌──────────┐          ┌──────────────┐
│ Supabase │          │Cloudflare│          │    Stripe    │
│(DB+Auth) │          │    R2    │          │  (支付处理)   │
│ 免费额度  │          │  10GB免费 │          │  无月费       │
└──────────┘          └──────────┘          └──────────────┘
```

---

## 第一步：准备账号

### 1.1 Supabase (数据库)

1. 访问 [supabase.com](https://supabase.com)
2. 注册账号
3. 创建新项目
4. 获取 **Project URL** 和 **Service Role Key**
   - Settings → API → Project URL
   - Settings → API → service_role key (注意不是 anon key)

### 1.2 Cloudflare R2 (文件存储)

1. 访问 [cloudflare.com](https://cloudflare.com)
2. 注册账号
3. 进入 R2 服务
4. 创建 Bucket
5. 获取 API Token
   - Manage R2 API Tokens → Create API Token
   - 权限：Object Read & Write

### 1.3 Stripe (支付)

1. 访问 [stripe.com](https://stripe.com)
2. 注册账号
3. 获取 API Keys
   - Developers → API Keys → Secret key
4. 设置 Webhook
   - Developers → Webhooks → Add endpoint
   - URL: `https://your-backend.railway.app/api/payments/webhook`
   - 选择事件：`checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

### 1.4 Kimi (OCR)

1. 访问 [platform.moonshot.cn](https://platform.moonshot.cn)
2. 注册账号
3. 创建 API Key

### 1.5 Railway (部署)

1. 访问 [railway.app](https://railway.app)
2. 用 GitHub 账号登录

---

## 第二步：配置后端

### 2.1 克隆代码

```bash
git clone https://github.com/your-username/cantosub-backend.git
cd cantosub-backend
```

### 2.2 安装依赖

```bash
npm install
```

### 2.3 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

JWT_SECRET=your-super-secret-key-at-least-32-characters

KIMI_API_KEY=sk-...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=cantosub-files

ADMIN_API_KEY=your-admin-dashboard-key
```

### 2.4 数据库迁移

```bash
npm run db:migrate
```

---

## 第三步：部署到 Railway

### 3.1 创建项目

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init
```

### 3.2 添加环境变量

```bash
railway variables

# 或者通过 Dashboard 添加
```

添加所有环境变量（见 2.3）

### 3.3 部署

```bash
railway up
```

### 3.4 获取域名

```bash
railway domain
```

复制生成的域名，例如：`https://cantosub-api.up.railway.app`

---

## 第四步：部署前端

### 4.1 更新前端 API 地址

编辑前端代码中的 API 配置：

```javascript
// src/config/api.js
const API_BASE_URL = 'https://your-backend.railway.app/api';
```

### 4.2 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

---

## 第五步：配置 Stripe Webhook

1. 进入 Stripe Dashboard
2. Developers → Webhooks
3. Add endpoint
4. Endpoint URL: `https://your-backend.railway.app/api/payments/webhook`
5. 选择事件：
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
6. 复制 Signing secret 到环境变量 `STRIPE_WEBHOOK_SECRET`

---

## 第六步：测试

### 6.1 健康检查

```bash
curl https://your-backend.railway.app/health
```

### 6.2 注册用户

```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 6.3 登录

```bash
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 费用估算（每月）

| 服务 | 免费额度 | 预估费用 |
|------|---------|---------|
| **Railway** | $5 | $5-20 |
| **Supabase** | 500MB DB + 1GB 存储 | $0 |
| **Cloudflare R2** | 10GB 存储 | $0 |
| **Stripe** | 无月费 | 按交易 2.9%+30¢ |
| **Kimi API** | 新用户赠送 | $10-50 |
| **Vercel** | 100GB 带宽 | $0 |

**总计：约 $15-70/月**（取决于用户量）

---

## 管理后台

访问管理后台：

```bash
curl https://your-backend.railway.app/api/admin/stats \
  -H "X-Admin-Api-Key: your-admin-api-key"
```

---

## 故障排查

### 问题：数据库连接失败

检查 `SUPABASE_SERVICE_KEY` 是否正确（不是 anon key）

### 问题：文件上传失败

检查 R2 配置和 Bucket 权限

### 问题：支付失败

检查 Stripe API Key 和 Webhook 配置

### 问题：OCR 失败

检查 Kimi API Key 是否有效

---

## 下一步

1. ✅ 部署后端到 Railway
2. ✅ 部署前端到 Vercel
3. ✅ 配置 Stripe Webhook
4. ✅ 测试完整流程
5. 🔄 添加更多功能（邮件通知、分析等）
