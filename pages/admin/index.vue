<template>
  <div class="dashboard">
    <h1 class="page-title">仪表盘</h1>
    
    <div class="stats-grid">
      <n-card class="stat-card" :bordered="false">
        <div class="stat-icon" style="background: #eef3ff; color: #3b82f6;">📦</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.productCount }}</div>
          <div class="stat-label">商品总数</div>
        </div>
      </n-card>
      
      <n-card class="stat-card" :bordered="false">
        <div class="stat-icon" style="background: #fef3c7; color: #f59e0b;">🔗</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.affiliateCategoryCount }}</div>
          <div class="stat-label">推荐分类</div>
        </div>
      </n-card>
      
      <n-card class="stat-card" :bordered="false">
        <div class="stat-icon" style="background: #dcfce7; color: #22c55e;">🔗</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.affiliateLinkCount }}</div>
          <div class="stat-label">推荐链接</div>
        </div>
      </n-card>
      
      <n-card class="stat-card" :bordered="false">
        <div class="stat-icon" style="background: #fce7f3; color: #ec4899;">⏰</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.lastSyncTime || '未同步' }}</div>
          <div class="stat-label">上次同步</div>
        </div>
      </n-card>
    </div>

    <div class="quick-actions">
      <h2 class="section-title">快捷操作</h2>
      <div class="action-grid">
        <n-button type="primary" size="large" @click="navigateTo('/admin/sync')">
          🔄 同步最新数据
        </n-button>
        <n-button size="large" @click="navigateTo('/admin/products')">
          📦 管理商品
        </n-button>
        <n-button size="large" @click="navigateTo('/admin/affiliates')">
          🔗 管理推荐
        </n-button>
        <n-button size="large" @click="navigateTo('/')">
          🏠 访问前台
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import naive from 'naive-ui'
const { NCard, NButton } = naive
definePageMeta({
  layout: 'admin',
})

const stats = ref({
  productCount: 0,
  affiliateCategoryCount: 0,
  affiliateLinkCount: 0,
  lastSyncTime: '',
})

onMounted(async () => {
  await loadStats()
})

async function loadStats() {
  try {
    const token = localStorage.getItem('admin_token')
    const headers = { Authorization: `Bearer ${token}` }
    
    const [products, affiliates] = await Promise.all([
      $fetch('/api/products', { query: { pageSize: 1 } }),
      $fetch('/api/affiliates'),
    ])
    
    stats.value = {
      productCount: (products as any).total || 0,
      affiliateCategoryCount: (affiliates as any).categories?.length || 0,
      affiliateLinkCount: (affiliates as any).links?.length || 0,
      lastSyncTime: localStorage.getItem('last_sync_time') || '',
    }
  } catch (e) {
    console.error('加载统计失败:', e)
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
}

.stat-card :deep(.n-card__content) {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 24px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
}

.action-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>