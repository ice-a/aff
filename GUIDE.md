# 🚀 使用指南

## 安装步骤

### 1. 安装 Node.js
确保你的电脑上安装了 Node.js 16+ 版本

### 2. 安装依赖
```bash
cd aff-links-manager
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

### 4. 构建生产版本
```bash
npm run build
```

生成的 `dist` 文件夹可以直接部署到任何静态托管服务

---

## 📋 配置你的链接

### 编辑配置文件
打开 `src/config/links.config.ts` 文件

### 添加新链接示例

```typescript
{
  id: '15',                          // 唯一ID（不要重复）
  title: '我的VPS服务',               // 标题
  description: '这是一个很棒的VPS服务商，速度快、价格低',  // 描述
  url: 'https://example.com/?ref=YOUR_CODE',  // 你的AFF链接
  category: 'vps',                   // 分类（见下方分类列表）
  tags: ['VPS', '便宜', '高速'],       // 标签
  commission: '首单立减$10',          // 推广奖励说明
  features: ['SSD存储', '全球节点', '24/7支持'],  // 产品特点
  color: '#FF6B6B',                  // 主题色（十六进制颜色码）
  icon: 'fa-server',                 // 图标（FontAwesome图标类名）
  createdAt: '2024-02-06'            // 添加日期
}
```

### 可用的分类ID

| 分类ID | 名称 | 用途 |
|--------|------|------|
| `vps` | VPS/服务器 | 云服务器、VPS主机 |
| `domain` | 域名注册 | 域名购买、转移 |
| `cdn` | CDN加速 | 内容分发网络 |
| `cloud` | 云服务 | 云平台服务 |
| `tool` | 开发工具 | IDE、代码托管等 |
| `finance` | 金融服务 | 支付、收款平台 |
| `other` | 其他推荐 | 其他类型服务 |

### 常用的 FontAwesome 图标

- `fa-server` - 服务器
- `fa-cloud` - 云
- `fa-globe` - 地球/域名
- `fa-bolt` - 闪电/CDN
- `fa-code` - 代码
- `fa-credit-card` - 信用卡/支付
- `fa-shield-alt` - 安全
- `fa-tools` - 工具
- `fa-star` - 星星/推荐
- `fa-heart` - 心形

更多图标查看：https://fontawesome.com/icons

---

## 🎨 自定义样式

### 修改主题色
编辑 `src/style.css` 文件中的 CSS 变量

```css
:root {
  --primary-color: #6366f1;      /* 主色调 */
  --secondary-color: #8b5cf6;    /* 次要色 */
  --accent-color: #ec4899;       /* 强调色 */
  /* ... */
}
```

### 修改背景
在 `src/style.css` 中修改 `body::before` 的样式

---

## 📊 功能说明

### 搜索功能
- 实时搜索链接标题、描述和标签
- 支持中文搜索
- 输入后自动筛选

### 分类筛选
- 点击顶部分类按钮快速筛选
- "全部" 显示所有链接
- 每个分类显示该分类的链接数量

### 视图切换
- 网格视图：适合浏览大量链接
- 列表视图：适合快速扫描信息

### 悬停效果
- 鼠标悬停时卡片放大并显示详细信息
- 显示推广奖励和产品特点
- 点击"立即访问"按钮打开链接

### 点击统计
- 自动记录每个链接的点击次数
- 数据保存在浏览器本地存储
- 可在"快速访问"面板查看热门链接

### 快速访问面板（右下角闪电按钮）
- 查看最近访问的链接
- 查看点击次数最多的热门链接
- 导出数据备份
- 清除统计数据

---

## 🌐 部署

### 部署到 Vercel

1. 安装 Vercel CLI
```bash
npm i -g vercel
```

2. 登录并部署
```bash
vercel
```

### 部署到 GitHub Pages

1. 构建项目
```bash
npm run build
```

2. 将 `dist` 文件夹推送到 GitHub

3. 在仓库设置中启用 GitHub Pages

### 部署到 Netlify

1. 构建项目
```bash
npm run build
```

2. 将 `dist` 文件夹拖拽到 Netlify

---

## 💡 使用技巧

1. **定期备份数据** - 使用快速访问面板的"导出数据"功能定期备份
2. **优化图片** - 如需自定义背景图，建议使用 WebP 格式以提高加载速度
3. **SEO优化** - 修改 `index.html` 中的 title 和 meta 标签
4. **分享功能** - 在移动设备上使用"分享"按钮可直接分享到社交媒体

---

## ❓ 常见问题

### Q: 如何修改页面标题？
A: 编辑 `index.html` 文件中的 `<title>` 标签

### Q: 如何添加自定义分类？
A: 在 `links.config.ts` 的 `categories` 数组中添加新的分类对象

### Q: 数据统计会丢失吗？
A: 数据保存在浏览器本地，清除浏览器数据会丢失。建议定期导出备份

### Q: 可以添加多少链接？
A: 理论上没有限制，但建议保持在 100 个以内以获得最佳性能

### Q: 支持多语言吗？
A: 当前版本为中文，修改文本内容即可支持其他语言

---

## 📞 技术支持

如有问题，请查看 README.md 或提交 Issue

祝你使用愉快！🎉
