# CantoSub Backend - GitHub + Railway 部署指南

## 问题说明

你遇到的问题是：
1. GitHub 仓库 `b358111/korean-subtitle-backend` 是空的，没有代码
2. Railway 部署失败，因为无法找到可构建的代码

## 解决步骤

### 第一步：在本地推送代码到 GitHub

在你的电脑上执行以下命令：

```bash
# 1. 克隆你的空仓库（或者创建新文件夹）
git clone https://github.com/b358111/korean-subtitle-backend.git
cd korean-subtitle-backend

# 2. 将所有后端代码文件复制到这个文件夹
# （把我给你的所有文件复制进来）

# 3. 添加并提交代码
git add .
git commit -m "Initial commit: CantoSub API backend"

# 4. 推送到 GitHub
git push origin main
```

### 第二步：在 Railway 重新部署

1. 登录 Railway 控制台：https://railway.app/dashboard
2. 进入你的项目
3. 点击 "Settings" → "Source"
4. 确保连接的是正确的 GitHub 仓库
5. 点击 "Redeploy" 或 "Deploy"

### 第三步：设置环境变量

部署成功后，在 Railway 设置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `SUPABASE_URL` | Supabase 项目 URL | https://xxxxx.supabase.co |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | eyJhbGciOiJIUzI1NiIs... |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | eyJhbGciOiJIUzI1NiIs... |
| `JWT_SECRET` | JWT 签名密钥 | your-super-secret-jwt-key-change-this |
| `KIMI_API_KEY` | Kimi API 密钥 | sk-xxxxxxxxxx |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | sk_test_xxxxxxxxxx |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 密钥 | whsec_xxxxxxxxxx |
| `FRONTEND_URL` | 前端网站地址 | https://your-frontend.com |
| `NODE_ENV` | 环境模式 | production |

### 第四步：验证部署

部署成功后，访问以下地址验证：

```
https://your-railway-app.up.railway.app/health
```

如果返回 `{"status":"ok"}`，说明部署成功！

## 文件结构

```
backend/
├── package.json          # 项目依赖
├── railway.json          # Railway 部署配置
├── README.md             # 项目说明
├── .env.example          # 环境变量示例
├── .gitignore            # Git 忽略文件
└── src/
    ├── index.js          # 服务器入口
    ├── db/
    │   ├── index.js      # Supabase 连接
    │   └── migrate.js    # 数据库迁移
    ├── middleware/
    │   └── auth.js       # JWT 认证中间件
    └── routes/
        ├── auth.js       # 用户认证 API
        ├── ocr.js        # OCR 识别 API
        ├── files.js      # 文件上传 API
        ├── payments.js   # 支付 API
        ├── usage.js      # 用量统计 API
        └── admin.js      # 管理后台 API
```

## 常见问题

### 1. Railway 构建失败

如果仍然构建失败，尝试：
- 检查 `package.json` 中的 `engines.node` 版本
- 在 Railway 设置中添加 `NIXPACKS_NODE_VERSION=18`

### 2. 数据库连接失败

- 检查 Supabase URL 和 Key 是否正确
- 确保 Supabase 项目已启用 Row Level Security
- 检查数据库表是否已创建

### 3. CORS 错误

- 检查 `FRONTEND_URL` 环境变量是否设置正确
- 确保包含 `https://` 前缀

## 需要帮助？

如果遇到问题，请提供：
1. Railway 的部署日志
2. 具体的错误信息
3. 环境变量是否已设置
