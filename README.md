# 甜甜育儿记录本 (Tiantian Cat Care Diary)

一个温馨治愈的宠物育儿记录 Web App，专为记录母猫和幼崽的成长点滴而设计。

## ✨ 功能特性

### 核心模块
- **首页 Dashboard** - 母猫信息卡、今日概览、快捷按钮、时间轴
- **幼崽管理** - 5只幼崽的详细信息、成长记录、体重曲线
- **喂食记录** - 多种食物类型、食用量、照片记录
- **喂药记录** - 药品名称、剂量、单位、备注
- **吃奶记录** - 计时功能、参与幼崽选择、时长统计
- **照片管理** - 瀑布流展示、分类、放大查看、懒加载、图片压缩
- **日历记录** - 月视图、每日记录统计、详情查看
- **统计分析** - Chart.js 图表、喂食趋势、喂药统计、吃奶频率
- **提醒功能** - Notification API、Web Push、自定义时间
- **PWA 支持** - 离线记录、自动同步、添加到桌面

### 特殊功能
- 导出 PDF 记录册和 Excel 记录表
- 搜索、标签、备注
- 图片批量上传
- 离线记录 + 自动同步
- 黑夜模式
- 数据迁移和备份
- 登录系统（Google / 微信扫码预留 / 邮箱 / 匿名）

## 🛠️ 技术栈

### 前端
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式框架
- **Shadcn/UI** - UI 组件库
- **Framer Motion** - 动画库
- **React Hook Form** - 表单处理
- **Zod** - 数据验证
- **Chart.js** - 数据可视化
- **Lucide Icons** - 图标库

### 后端
- **Supabase** - PostgreSQL + Storage + Realtime
- **Service Worker** - PWA 离线支持
- **Web Push** - 推送通知

## 🎨 UI 风格

- **主色**: 淡紫色 `#A78BFA`
- **辅助色**: 浅粉 `#F9A8D4`、奶白 `#FFF7ED`
- **圆角**: 24px
- **阴影**: 柔和卡片阴影
- **动画**: 轻量级丝滑动画
- **响应式**: 移动端优先，微信浏览器完全适配

## 📁 项目结构

```
tiantian-cat-care/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页 Dashboard
│   │   ├── kittens/           # 幼崽管理
│   │   ├── feeding/           # 喂食记录
│   │   ├── medicine/          # 喂药记录
│   │   ├── nursing/           # 吃奶记录
│   │   ├── photos/            # 照片管理
│   │   ├── calendar/          # 日历记录
│   │   ├── stats/             # 统计分析
│   │   ├── reminders/         # 提醒设置
│   │   └── settings/          # 设置页面
│   ├── components/            # 组件
│   │   ├── layout/            # 布局组件
│   │   └── ui/                # UI 组件 (Shadcn)
│   ├── lib/                   # 工具库
│   │   ├── storage.ts         # 本地存储
│   │   └── supabase.ts        # Supabase 客户端
│   ├── types/                 # TypeScript 类型
│   └── utils/                 # 工具函数
├── public/                    # 静态资源
│   ├── manifest.json          # PWA 配置
│   └── sw.js                  # Service Worker
├── supabase/                  # 数据库 Schema
│   └── schema.sql             # 建表语句
├── .github/workflows/         # GitHub Actions
├── Dockerfile                 # Docker 配置
├── docker-compose.yml         # Docker Compose
└── README.md                  # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js >= 20
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

### 导出静态站点 (GitHub Pages)

```bash
npm run export
```

## 📦 部署

### Vercel (推荐)

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 一键部署

### Netlify

```bash
npm run build
# 将 .next 或 out 目录部署到 Netlify
```

### GitHub Pages

1. 配置 GitHub Pages
2. Push 到 main 分支
3. GitHub Actions 自动部署

### Docker

```bash
# 构建镜像
docker build -t tiantian-cat-care .

# 运行容器
docker run -p 3000:3000 tiantian-cat-care
```

### Docker Compose

```bash
docker-compose up -d
```

## 🗄️ 数据库设计

### 表结构
- `users` - 用户表
- `mother_cat` - 母猫信息表
- `kittens` - 幼崽信息表
- `feeding_logs` - 喂食记录表
- `medicine_logs` - 喂药记录表
- `nursing_logs` - 吃奶记录表
- `photos` - 照片表
- `reminders` - 提醒表

详细 SQL 语句请查看 `supabase/schema.sql`

## 🔧 配置

### 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 应用配置
NEXT_PUBLIC_APP_NAME=甜甜育儿记录本
```

### Supabase 设置

1. 创建 Supabase 项目
2. 执行 `supabase/schema.sql` 创建表
3. 配置 Storage bucket
4. 设置 RLS 策略

## 📱 PWA 功能

- ✅ 添加到主屏幕
- ✅ 离线访问
- ✅ 后台同步
- ✅ 推送通知
- ✅ 全屏体验

## 🌙 黑夜模式

支持自动跟随系统和手动切换，在设置页面中可切换主题。

## 💾 数据备份

在设置页面可以：
- 导出所有数据为 JSON
- 导入 JSON 数据恢复
- 清除所有数据

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，欢迎通过 Issue 联系我们。

---

**用心记录每一刻成长 💜**
