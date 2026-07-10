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

## 生产构建

```bash
npm run build
node .output/server/index.mjs
```
