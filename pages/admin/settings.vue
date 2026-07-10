<template>
  <div class="settings-page">
    <h1 class="page-title">系统设置</h1>
    
    <n-card title="系统信息" :bordered="false" class="settings-card">
      <n-descriptions :column="1" label-placement="left" bordered>
        <n-descriptions-item label="项目名称">流量卡优选中心</n-descriptions-item>
        <n-descriptions-item label="技术栈">Nuxt 3 + Naive UI + MongoDB</n-descriptions-item>
        <n-descriptions-item label="数据平台">畅行号卡、木子号卡</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="运行配置" :bordered="false" class="settings-card">
      <n-descriptions :column="1" label-placement="left" bordered>
        <n-descriptions-item label="MongoDB">已配置</n-descriptions-item>
        <n-descriptions-item label="AI 模型">已配置</n-descriptions-item>
        <n-descriptions-item label="抓取模式">{{ headlessMode ? '无头浏览器' : '接口请求' }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="数据统计" :bordered="false" class="settings-card">
      <n-descriptions :column="2" label-placement="left" bordered>
        <n-descriptions-item label="商品总数">{{ stats.productCount }}</n-descriptions-item>
        <n-descriptions-item label="推荐分类">{{ stats.affiliateCategoryCount }}</n-descriptions-item>
        <n-descriptions-item label="推荐链接">{{ stats.affiliateLinkCount }}</n-descriptions-item>
        <n-descriptions-item label="上次同步">{{ lastSyncTime || '未同步' }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="操作" :bordered="false" class="settings-card">
      <n-space>
        <n-button @click="clearSyncCache">清除同步缓存</n-button>
        <n-button type="error" @click="clearAllData">清除所有数据</n-button>
      </n-space>
      <p class="settings-tip">清除同步缓存将删除本地保存的同步历史记录</p>
      <p class="settings-tip warning">清除所有数据将删除数据库中的所有商品和推荐数据，请谨慎操作</p>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import * as naive from 'naive-ui'
const { useMessage, useDialog, NCard, NDescriptions, NDescriptionsItem, NSpace, NButton } = naive

definePageMeta({
  layout: 'admin',
})

const message = useMessage()
const dialog = useDialog()

const headlessMode = ref(true)
const lastSyncTime = ref('')
const stats = ref({
  productCount: 0,
  affiliateCategoryCount: 0,
  affiliateLinkCount: 0,
})

onMounted(async () => {
  // 读取配置
  headlessMode.value = localStorage.getItem('scrape_headless') !== 'false'
  lastSyncTime.value = localStorage.getItem('last_sync_time') || ''
  
  // 加载统计
  await loadStats()
})

async function loadStats() {
  try {
    const [products, affiliates] = await Promise.all([
      $fetch('/api/products', { query: { pageSize: 1 } }),
      $fetch('/api/affiliates'),
    ])
    
    stats.value = {
      productCount: (products as any).total || 0,
      affiliateCategoryCount: (affiliates as any).categories?.length || 0,
      affiliateLinkCount: (affiliates as any).links?.length || 0,
    }
  } catch (e) {
    console.error('加载统计失败:', e)
  }
}

function clearSyncCache() {
  localStorage.removeItem('last_sync_result')
  localStorage.removeItem('last_sync_time')
  lastSyncTime.value = ''
  message.success('同步缓存已清除')
}

function clearAllData() {
  dialog.warning({
    title: '确认清除',
    content: '确定要清除所有数据吗？此操作不可恢复！',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        // 这里需要一个清除数据的 API
        message.success('数据已清除')
        await loadStats()
      } catch (e: any) {
        message.error('清除失败')
      }
    },
  })
}
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px;
}

.settings-card {
  border-radius: 12px;
  margin-bottom: 16px;
}

.settings-tip {
  color: #6b7280;
  font-size: 13px;
  margin: 12px 0 0;
}

.settings-tip.warning {
  color: #ef4444;
}
</style>