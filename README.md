# AFF链接管理系统

一个功能丰富、界面精美的纯前端 AFF 邀请链接管理应用。采用 Vue 3 + TypeScript + Vite 构建，无需后端即可部署使用。

![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ 功能特性

### 🎨 视觉效果
- **毛玻璃效果** - 现代化的玻璃拟态设计
- **渐变配色** - 优雅的渐变色主题
- **动画过渡** - 流畅的页面切换和交互动画
- **随机背景** - 每张卡片都有独特的随机背景图

### 🗂️ 组织管理
- **分类筛选** - 支持7种预设分类（VPS、域名、CDN、云服务、工具、金融、其他）
- **搜索功能** - 实时搜索标题、描述和标签
- **视图切换** - 网格视图和列表视图自由切换
- **标签系统** - 为每个链接添加自定义标签

### 💫 交互体验
- **悬停详情** - 鼠标悬停显示完整信息和奖励详情
- **一键复制** - 快速复制链接到剪贴板
- **点击统计** - 自动记录每个链接的点击次数
- **详情弹窗** - 点击卡片查看完整的链接信息

### 📱 响应式设计
- **移动端适配** - 完美支持手机、平板和桌面设备
- **触摸友好** - 针对触摸设备优化的交互体验
- **自适应布局** - 根据屏幕大小自动调整布局

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建后的文件位于 `dist` 目录，可直接部署到任何静态托管服务。

## 📁 项目结构

```
├── public/                 # 静态资源
├── src/
│   ├── components/         # Vue组件
│   │   ├── LinkCard.vue   # 链接卡片组件
│   │   └── LinkDetail.vue # 详情弹窗组件
│   ├── config/
│   │   └── links.config.ts # 链接配置文件
│   ├── App.vue            # 主应用组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📝 配置说明

### 添加/修改链接

编辑 `src/config/links.config.ts` 文件：

```typescript
export const affLinks: AffLink[] = [
  {
    id: '1',                          // 唯一ID
    title: '服务名称',                 // 标题
    description: '服务描述...',        // 描述
    url: 'https://example.com/?ref=xxx', // 推广链接
    category: 'vps',                  // 分类ID
    tags: ['标签1', '标签2'],          // 标签
    commission: '奖励说明',            // 推广奖励
    features: ['特点1', '特点2'],      // 产品特点
    color: '#FF6B6B',                 // 主题色
    icon: 'fa-server',                // FontAwesome图标
    createdAt: '2024-01-01'           // 添加日期
  }
]
```

### 添加新分类

```typescript
export const categories: Category[] = [
  {
    id: 'custom',                     // 分类ID
    name: '自定义分类',                // 显示名称
    icon: 'fa-icon-name',             // FontAwesome图标类
    color: '#FF0000'                  // 分类颜色
  }
]
```

### 自定义随机背景API

在 `links.config.ts` 中修改 `randomImageAPIs` 数组：

```typescript
export const randomImageAPIs = [
  'https://your-image-api.com/400/300?random=',
  'https://another-api.com/image?seed='
]
```

## 🎨 自定义主题

修改 `src/style.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #6366f1;      /* 主色调 */
  --secondary-color: #8b5cf6;    /* 次要色 */
  --accent-color: #ec4899;       /* 强调色 */
  --bg-primary: #0f172a;         /* 主背景色 */
  /* ... 其他变量 */
}
```

## 📊 数据统计

点击统计数据存储在浏览器的 `localStorage` 中，键名为 `clickStats`。

## 🔒 隐私说明

- 所有数据存储在本地，不会上传到任何服务器
- 无需登录或注册
- 纯前端实现，可离线使用

## 🌐 部署建议

### 免费托管平台
- **Vercel** - `vercel --prod`
- **Netlify** - 拖拽 `dist` 文件夹
- **GitHub Pages** - 推送到 gh-pages 分支
- **Cloudflare Pages** - 自动部署

### 自定义域名
1. 构建项目: `npm run build`
2. 将 `dist` 文件夹内容上传到服务器
3. 配置 nginx/apache 指向该目录

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **CSS3** - 现代化样式技术
- **FontAwesome** - 图标库

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 💡 小贴士

1. **定期更新链接** - 检查链接是否有效，及时更新失效链接
2. **优化图片加载** - 可以替换成自己的 CDN 图片以加快加载速度
3. **SEO优化** - 修改 `index.html` 中的 meta 标签提升搜索引擎排名
4. **添加分析** - 可以集成 Google Analytics 或百度统计

---

制作 with ❤️ using Vue 3
