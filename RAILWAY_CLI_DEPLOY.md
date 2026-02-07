# Railway CLI 直接部署指南（无需 GitHub）

## 方法：使用 Railway CLI 直接部署

如果你不想通过 GitHub，可以直接用 Railway CLI 从本地部署。

### 第一步：安装 Railway CLI

```bash
# macOS
brew install railway

# Windows (PowerShell)
powershell -Command "iwr https://railway.app/install.ps1 -useb | iex"

# Linux
curl -fsSL https://railway.app/install.sh | sh
```

### 第二步：登录 Railway

```bash
railway login
```

这会打开浏览器让你登录 Railway 账号。

### 第三步：进入项目目录并关联

```bash
# 进入后端代码目录
cd /path/to/backend

# 关联到 Railway 项目
railway link
```

选择你创建的项目。

### 第四步：设置环境变量

```bash
# 设置所有必要的环境变量
railway variables set SUPABASE_URL="https://your-project.supabase.co"
railway variables set SUPABASE_ANON_KEY="your-anon-key"
railway variables set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
railway variables set JWT_SECRET="your-super-secret-key"
railway variables set KIMI_API_KEY="your-kimi-api-key"
railway variables set STRIPE_SECRET_KEY="your-stripe-key"
railway variables set FRONTEND_URL="https://your-frontend.com"
railway variables set NODE_ENV="production"
```

### 第五步：部署

```bash
railway up
```

这条命令会：
1. 构建你的应用
2. 部署到 Railway
3. 自动启动服务

### 第六步：查看日志

```bash
railway logs
```

### 第七步：获取部署地址

```bash
railway domain
```

这会显示你的 API 地址，例如：
`https://korean-subtitle-backend-production.up.railway.app`

## 常用命令

```bash
# 查看项目状态
railway status

# 查看环境变量
railway variables

# 重新部署
railway up

# 查看实时日志
railway logs --tail

# 断开项目关联
railway unlink
```

## 更新部署

当你修改代码后，只需再次运行：

```bash
railway up
```

## 优势

- ✅ 不需要 GitHub 仓库
- ✅ 部署速度更快
- ✅ 可以直接从本地部署
- ✅ 实时查看日志

## 注意事项

1. 确保 `package.json` 中的 `start` 脚本正确
2. 确保 `railway.json` 配置正确
3. 所有环境变量必须设置完整
