# CantoSub AI - 技术规格文档

## 1. 组件清单

### shadcn/ui 组件
- `button` - 按钮
- `card` - 卡片
- `input` - 输入框
- `label` - 标签
- `select` - 下拉选择
- `dialog` - 对话框
- `dropdown-menu` - 下拉菜单
- `accordion` - 手风琴
- `tabs` - 标签页
- `progress` - 进度条
- `badge` - 徽章
- `separator` - 分隔线
- `sheet` - 侧边抽屉
- `toast` - 通知提示
- `skeleton` - 骨架屏

### 自定义组件
- `Navbar` - 导航栏
- `Hero` - 首屏区块
- `TrustBadges` - 信任标志轮播
- `Features` - 功能特点
- `Pricing` - 定价卡片
- `FAQ` - 常见问题
- `Footer` - 页脚
- `LoginForm` - 登录表单
- `SignupForm` - 注册表单
- `FileUploader` - 文件上传组件
- `SubtitleEditor` - 字幕编辑器
- `VoiceRecorder` - 语音录制组件
- `OCRProcessor` - OCR处理组件
- `LanguageSelector` - 语言选择器

### 自定义 Hooks
- `useAuth` - 认证状态管理
- `useUpload` - 文件上传逻辑
- `useSpeechRecognition` - 语音识别
- `useIntersectionObserver` - 滚动动画

---

## 2. 动画实现计划

| 动画效果 | 库 | 实现方式 | 复杂度 |
|---------|-----|---------|-------|
| 页面加载淡入 | Framer Motion | AnimatePresence + motion.div | 低 |
| 滚动触发显示 | Framer Motion | whileInView + viewport | 中 |
| Hero 文字 stagger | Framer Motion | staggerChildren | 低 |
| 卡片悬停效果 | Tailwind CSS | hover:translate-y + shadow | 低 |
| 按钮悬停 | Tailwind CSS | hover:scale + transition | 低 |
| 信任标志轮播 | CSS Animation | @keyframes scroll | 中 |
| FAQ 展开/收起 | Framer Motion | AnimatePresence + height | 中 |
| 导航栏滚动效果 | React State | useScroll + 条件样式 | 低 |
| 上传进度条 | Framer Motion | animate width | 低 |
| 音频波形动画 | CSS/Canvas | 动态高度条 | 高 |
| 语音录制脉冲 | CSS Animation | pulse keyframes | 低 |

---

## 3. 项目文件结构

```
/mnt/okcomputer/output/app/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-image.png
│   │   └── creators/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── TrustBadges.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── ProductUpdate.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTASection.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── dashboard/
│   │       ├── FileUploader.tsx
│   │       ├── SubtitleEditor.tsx
│   │       ├── VoiceRecorder.tsx
│   │       └── OCRProcessor.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUpload.ts
│   │   ├── useSpeechRecognition.ts
│   │   └── useScrollAnimation.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── i18n.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Pricing.tsx
│   │   ├── About.tsx
│   │   └── Dashboard.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 依赖清单

### 核心依赖
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-*": "latest"
  }
}
```

### 功能依赖
```json
{
  "dependencies": {
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.0",
    "tesseract.js": "^5.0.0",
    "react-dropzone": "^14.2.0",
    "axios": "^1.6.0"
  }
}
```

### 开发依赖
```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 5. 技术实现要点

### 语音识别 (Web Speech API)
```typescript
// 使用浏览器原生 Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'zh-HK'; // 粤语
recognition.continuous = true;
recognition.interimResults = true;
```

### OCR 实现 (Tesseract.js)
```typescript
import Tesseract from 'tesseract.js';

const result = await Tesseract.recognize(
  imageData,
  'chi_tra+eng', // 繁体中文+英文
  { logger: m => console.log(m) }
);
```

### 文件上传
- 支持拖拽上传
- 进度显示
- 格式验证 (MP4, MOV, AVI, MP3, WAV)
- 大小限制提示

### 国际化 (i18n)
- 支持: 繁体中文、简体中文、英文、日文
- 使用 react-i18next
- 语言切换持久化

---

## 6. 路由结构

```typescript
const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/about', element: <About /> },
  { path: '/dashboard', element: <Dashboard />, protected: true },
];
```

---

## 7. 状态管理

使用 React Context + useReducer 管理:
- 用户认证状态
- 语言设置
- 上传文件列表
- 字幕项目

---

## 8. 性能优化

- 图片懒加载
- 组件代码分割
- 动画使用 transform/opacity
- 支持 prefers-reduced-motion
- 字体预加载
