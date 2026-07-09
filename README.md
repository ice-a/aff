# 流量卡优选中心

聚合多平台流量卡（号卡）资源、AI 提取套餐信息并按有效期跨平台对比的推广型网站。

技术栈：**Nuxt 3（前后端一体 / SSR）+ MongoDB + Element Plus + Playwright（爬虫）+ OpenAI 兼容大模型（AI 提取）**。

## 功能

- 推广首页：按运营商 / 来源平台 / 关键词筛选，卡片流展示流量卡
- 商品详情：AI 提取的运营商、有效期、流量、通话、月租、办理年龄、地区、选号/照片要求
- 跨平台对比：同一套餐在「畅行号卡」与「木子号卡」的有效期对比，标注更长期的一方
- 数据采集：无头浏览器渲染源平台页面后从 DOM 提取商品 → AI 提取结构化字段 → 写入 MongoDB
- AI 提取：默认通义千问（DashScope OpenAI 兼容接口），可换智谱/Kimi；无 Key 时自动降级为规则提取

## 目录结构

```
nuxt.config.ts          运行时配置（读取 .env）
types/index.ts          共享类型
server/
  models/product.ts     MongoDB 商品模型
  utils/mongo.ts        连接（支持真实 Mongo 或 memory:// 内存回退）
  services/
    ai.ts               AI / 规则 提取有效期等字段
    scraper/            平台1 / 平台2 爬虫 + 编排
    compare.ts          跨平台匹配与对比
  api/                  /api/products, /api/products/[id], /api/compare, /api/scrape
  scripts/seed.ts       示例数据（无需浏览器即可预览）
pages/ components/      前端 UI（Element Plus）
```

## 快速开始

```bash
npm install
cp .env.example .env        # 已附默认 .env，可直接用
npm run seed                # 写入示例商品（无需联网/浏览器即可预览）
npm run dev                 # 启动开发服务器 http://localhost:3000
```

> 默认 `.env` 使用 `MONGODB_URI=memory://`（首次运行自动下载 mongod 二进制），无需本地安装 MongoDB。
> 接真实 MongoDB：把 `.env` 里的 `MONGODB_URI` 改为 `mongodb://127.0.0.1:27017`（或 Atlas 连接串）。

## 接入大模型（可选）

在 `.env` 填入 `AI_API_KEY` 与对应 `AI_BASE_URL` / `AI_MODEL`。不填则用内置正则规则提取有效期/流量等。

## 从源平台抓取真实数据

点击页面右上角「同步最新数据」，或：

```bash
curl -X POST http://localhost:3000/api/scrape
```

抓取采用 **Playwright 无头浏览器**加载源平台页面（契合「爬网页 HTML」），由页面自身完成鉴权后从渲染后的 DOM 提取。
两个源平台：

- 平台1 畅行号卡 `https://260709.chshebei.cn`（商品在 `/ProductEn/Index/{店铺id}` 渲染）
- 平台2 木子号卡 `https://leemuzi.hemorn.cn`（Vue SPA，`#productList` 渲染）

> 若源平台需要登录态/Token，可在 `nuxt.config.ts` 的 `platform1/platform2` 中补充鉴权参数，
> 或在 `server/services/scraper/*.ts` 注入 Cookie 后重试。

## 生产构建

```bash
npm run build
node .output/server/index.mjs
```
