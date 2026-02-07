# CantoSub AI Backend API

完整的 SaaS 后端系统，包含用户认证、用量追踪、支付系统和文件存储。

## 功能特性

- ✅ **用户认证** - JWT + Supabase Auth
- ✅ **用量追踪** - 实时监控每个用户的分钟数和存储用量
- ✅ **支付系统** - Stripe 订阅管理（Basic/Pro/Premium）
- ✅ **文件存储** - Cloudflare R2（每个用户1GB）
- ✅ **OCR API** - Kimi 视觉模型
- ✅ **管理后台** - 用户管理、统计报表

## 技术栈

- Node.js + Express
- Supabase (PostgreSQL + Auth)
- Stripe (支付)
- Cloudflare R2 (文件存储)
- Kimi API (OCR)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入你的配置
```

### 3. 数据库迁移

```bash
npm run db:migrate
```

### 4. 启动服务器

```bash
npm run dev
```

## 部署到 Railway

### 1. 创建 Railway 账号

访问 [Railway](https://railway.app) 注册账号

### 2. 创建新项目

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init
```

### 3. 添加环境变量

在 Railway Dashboard 中添加以下环境变量：

- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `KIMI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `ADMIN_API_KEY`

### 4. 部署

```bash
railway up
```

## API 文档

### 认证

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/me` | 获取当前用户 |
| POST | `/api/auth/google` | Google OAuth |

### OCR

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/ocr/image` | 图片OCR |
| POST | `/api/ocr/video` | 视频硬字幕提取 |

### 文件

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/files/upload` | 上传文件 |
| GET | `/api/files/list` | 获取文件列表 |
| GET | `/api/files/:id/download` | 获取下载链接 |
| DELETE | `/api/files/:id` | 删除文件 |

### 支付

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/payments/create-subscription` | 创建订阅 |
| GET | `/api/payments/subscription` | 获取订阅信息 |
| POST | `/api/payments/cancel-subscription` | 取消订阅 |
| POST | `/api/payments/webhook` | Stripe Webhook |

### 用量

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/usage/stats` | 获取用量统计 |
| GET | `/api/usage/history` | 获取用量历史 |

### 管理后台

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/admin/users` | 获取所有用户 |
| GET | `/api/admin/stats` | 获取系统统计 |
| PATCH | `/api/admin/users/:id/plan` | 更新用户计划 |
| POST | `/api/admin/reset-usage` | 重置用量 |

## 定价方案

| 方案 | 月费 | 年费 | 分钟数 | 存储 |
|------|------|------|--------|------|
| Free | 免费 | - | 30分钟 | 1GB |
| Basic | HKD $78 | HKD $780 | 90分钟 | 10GB |
| Pro | HKD $118 | HKD $1180 | 180分钟 | 50GB |
| Premium | HKD $312 | HKD $3120 | 600分钟 | 100GB |

## 许可证

MIT
