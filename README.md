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
- **稳定的随机渐变背景** - 通过 `getRandomGradient(id)` 按链接 ID 哈希从 `gradientColors` 数组**确定性**选取 CSS `linear-gradient`，每张卡片的渐变固定不变（刷新/重渲染后保持一致，不会每次随机变化）

### 🗂️ 组织管理
- **分类筛选** - 支持 11 种预设分类（虚拟币、VPN服务、VPS/服务器、域名注册、CDN加速、云服务、开发工具、金融服务、其他推荐、影视、爱喝水的木子）
- **搜索功能** - 实时搜索标题、描述和标签
- **视图切换** - 网格视图和**列表视图**自由切换（列表视图现已可用，`:is-list-view` 正确传递给 `LinkCard`）
- **标签系统** - 为每个链接添加自定义标签

### ⚡ 快速访问面板
`QuickAccess.vue` 提供一个右下角悬浮的快捷面板，包含：
- **最近访问** - 基于 `recentVisits` 展示最近浏览过的链接
- **热门推荐** - 按点击数从高到低排序的链接
- **导出数据** - 将链接与统计数据导出为 JSON 备份文件
- **清除统计** - 一键清空所有点击与访问记录

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

使用 npm：

```bash
npm install
```

或使用 pnpm（本项目推荐使用 pnpm）：

```bash
pnpm install
```

> ⚠️ **pnpm 用户注意**：若执行 `pnpm i` 时报 `ERR_PNPM_IGNORED_BUILDS`（通常是 esbuild 未被允许构建），请运行 `pnpm approve-builds` 批准 esbuild 的构建脚本，或在 `package.json` 中添加：
> ```json
> "pnpm": { "onlyBuiltDependencies": ["esbuild"] }
> ```
> 然后重新执行 `pnpm install`。否则 Vite 将因 esbuild 未正确构建而无法启动。

### 开发模式

```bash
npm run dev      # 或 pnpm dev
```

### 构建生产版本

```bash
npm run build    # 或 pnpm build
```

构建后的文件位于 `dist` 目录，可直接部署到任何静态托管服务。

## 📁 项目结构

```
├── src/
│   ├── components/
│   │   ├── LinkCard.vue       # 链接卡片组件
│   │   ├── LinkDetail.vue     # 详情弹窗组件
│   │   └── QuickAccess.vue    # 快速访问面板（最近访问/热门推荐/导出/清除）
│   ├── composables/
│   │   └── useLinkStats.ts    # 共享统计 store（点击数 + 最近访问，模块级单例）
│   ├── config/
│   │   └── links.config.ts    # 链接与分类配置（含 gradientColors / getRandomGradient）
│   ├── App.vue                # 主应用组件
│   ├── main.ts                # 入口文件
│   └── style.css              # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
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

### 自定义卡片渐变背景

卡片背景并非随机图片，而是由 `getRandomGradient(id)` 根据链接 ID 的哈希值，从 `links.config.ts` 中的 `gradientColors` 数组确定性地挑选一个 CSS 渐变。如需调整配色，直接编辑 `gradientColors` 数组即可——每个 ID 对应的渐变是固定不变的。

```typescript
export const gradientColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  // ...更多渐变组合
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

点击与访问数据存储在浏览器的 `localStorage` 中，使用两个独立的键名：

- `clickStats` - 每个链接的点击次数（以链接 ID 为键的计数字典）
- `recentVisits` - 最近浏览过的链接 ID 列表（去重并限制长度）

上述数据由 `src/composables/useLinkStats.ts` 统一集中管理。该模块以**模块级单例**形式导出，确保 `App`、`LinkDetail` 和 `QuickAccess` 共享同一份响应式状态：任何一处记录的点击/访问都会实时反映到总点击数、详情弹窗的点击次数、快速访问面板的「最近访问」与「热门推荐」中。

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
1. 构建项目: `npm run build`（或 `pnpm build`）
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
2. **优化体验** - 调整 `gradientColors` 改变卡片渐变观感，无需额外网络请求
3. **SEO优化** - 修改 `index.html` 中的 meta 标签提升搜索引擎排名
4. **添加分析** - 可以集成 Google Analytics 或百度统计

---

制作 with ❤️ using Vue 3
