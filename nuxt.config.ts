import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@vercel/analytics'],
  devtools: { enabled: false },
  ssr: true,
  nitro: {
    preset: 'vercel',
  },
  noExternal: ['naive-ui', '@css-render/vue3-ssr'],
  transpile: ['naive-ui', '@css-render/vue3-ssr'],
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['naive-ui'],
    },
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
    mongodbDb: process.env.MONGODB_DB || 'traffic_card_hub',
    aiApiKey: process.env.AI_API_KEY || '',
    aiBaseUrl: process.env.AI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    aiModel: process.env.AI_MODEL || 'qwen-plus',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    scrapeHeadless: (process.env.SCRAPE_HEADLESS ?? 'true') === 'true',
    platform1: {
      name: process.env.P1_NAME || '畅行号卡',
      shopId: process.env.P1_SHOP_ID || '00de96ec16cfec53',
      baseUrl: process.env.P1_BASE_URL || 'https://260709.chshebei.cn',
    },
    platform2: {
      name: process.env.P2_NAME || '木子号卡',
      baseUrl: process.env.P2_BASE_URL || 'https://leemuzi.hemorn.cn',
    },
  },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2024-11-09',
})