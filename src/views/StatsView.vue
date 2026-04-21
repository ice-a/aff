<template>
  <div class="stats-view">
    <!-- 页面头部 -->
    <header class="stats-view__header">
      <div class="stats-view__container">
        <div class="stats-view__title-group">
          <h1 class="stats-view__title">
            <i class="fas fa-chart-line"></i>
            数据统计
          </h1>
          <p class="stats-view__subtitle">
            深入了解您的链接使用情况和访问趋势
          </p>
        </div>
        <div class="stats-view__actions">
          <button class="btn btn-secondary" @click="exportReport">
            <i class="fas fa-download"></i>
            导出报告
          </button>
          <button class="btn btn-primary" @click="refreshData">
            <i class="fas fa-sync-alt"></i>
            刷新数据
          </button>
        </div>
      </div>
    </header>

    <!-- 统计面板 -->
    <StatsPanel />

    <!-- 详细分析 -->
    <div class="stats-view__container">
      <!-- 时间范围选择 -->
      <section class="time-range-selector">
        <h3 class="section-title">
          <i class="fas fa-calendar-alt"></i>
          时间分析
        </h3>
        <div class="time-range-tabs">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            :class="['time-range-tab', { 'time-range-tab--active': selectedTimeRange === range.value }]"
            @click="selectedTimeRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>
      </section>

      <!-- 访问趋势图 -->
      <section class="trend-chart">
        <h3 class="section-title">
          <i class="fas fa-chart-area"></i>
          访问趋势
        </h3>
        <div class="chart-container">
          <div class="chart-placeholder">
            <i class="fas fa-chart-line"></i>
            <p>访问趋势图表</p>
            <small>显示选定时间范围内的点击趋势</small>
          </div>
        </div>
      </section>

      <!-- 分类对比 -->
      <section class="category-comparison">
        <h3 class="section-title">
          <i class="fas fa-balance-scale"></i>
          分类对比
        </h3>
        <div class="comparison-grid">
          <div
            v-for="category in categoryStats"
            :key="category.id"
            class="comparison-card"
          >
            <div class="comparison-card__header">
              <i :class="['fas', category.icon]" :style="{ color: category.color }"></i>
              <h4>{{ category.name }}</h4>
            </div>
            <div class="comparison-card__stats">
              <div class="stat">
                <span class="stat-value">{{ category.count }}</span>
                <span class="stat-label">链接数</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ category.clicks }}</span>
                <span class="stat-label">总点击</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ category.avgClicks.toFixed(1) }}</span>
                <span class="stat-label">平均点击</span>
              </div>
            </div>
            <div class="comparison-card__progress">
              <div
                class="progress-bar"
                :style="{ width: category.clickPercentage + '%', backgroundColor: category.color }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细数据表 -->
      <section class="detailed-table">
        <div class="table-header">
          <h3 class="section-title">
            <i class="fas fa-table"></i>
            详细数据
          </h3>
          <div class="table-filters">
            <select v-model="sortBy" class="filter-select">
              <option value="clicks">按点击量排序</option>
              <option value="title">按标题排序</option>
              <option value="category">按分类排序</option>
              <option value="createdAt">按添加时间排序</option>
            </select>
            <select v-model="filterCategory" class="filter-select">
              <option value="all">全部分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>链接</th>
                <th>分类</th>
                <th>点击量</th>
                <th>添加时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="link in sortedAndFilteredLinks" :key="link.id">
                <td class="link-cell">
                  <div class="link-info">
                    <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
                    <div class="link-details">
                      <span class="link-title">{{ link.title }}</span>
                      <span class="link-description">{{ link.description }}</span>
                    </div>
                  </div>
                </td>
                <td class="category-cell">
                  <span class="category-badge" :style="getCategoryStyle(link.category)">
                    {{ getCategoryName(link.category) }}
                  </span>
                </td>
                <td class="clicks-cell">
                  <span class="clicks-value">{{ link.clicks }}</span>
                </td>
                <td class="date-cell">
                  {{ formatDate(link.createdAt) }}
                </td>
                <td class="actions-cell">
                  <button class="action-btn" @click="viewLink(link)" title="查看详情">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-btn" @click="copyLink(link)" title="复制链接">
                    <i class="fas fa-copy"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 空状态 -->
          <div v-if="sortedAndFilteredLinks.length === 0" class="table-empty">
            <i class="fas fa-inbox"></i>
            <p>没有找到匹配的数据</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { affLinks, categories, type AffLink } from '../config/links.config'
import StatsPanel from '../components/StatsPanel.vue'

// 响应式状态
const clickStats = ref<Record<string, number>>({})
const selectedTimeRange = ref('7d')
const sortBy = ref('clicks')
const filterCategory = ref('all')

// 时间范围选项
const timeRanges = [
  { value: '1d', label: '今天' },
  { value: '7d', label: '最近7天' },
  { value: '30d', label: '最近30天' },
  { value: '90d', label: '最近3个月' },
  { value: 'all', label: '全部时间' }
]

// 计算属性
const categoryStats = computed(() => {
  const stats = categories.map(category => {
    const categoryLinks = affLinks.filter(link => link.category === category.id)
    const categoryClicks = categoryLinks.reduce((sum, link) => {
      return sum + (clickStats.value[link.id] || 0)
    }, 0)
    const avgClicks = categoryLinks.length > 0 ? categoryClicks / categoryLinks.length : 0
    const clickPercentage = totalClicks.value > 0 ? (categoryClicks / totalClicks.value) * 100 : 0

    return {
      ...category,
      count: categoryLinks.length,
      clicks: categoryClicks,
      avgClicks,
      clickPercentage
    }
  })

  return stats.sort((a, b) => b.clicks - a.clicks)
})

const totalClicks = computed(() => {
  return Object.values(clickStats.value).reduce((sum, count) => sum + count, 0)
})

const sortedAndFilteredLinks = computed(() => {
  let links = affLinks.map(link => ({
    ...link,
    clicks: clickStats.value[link.id] || 0
  }))

  // 分类筛选
  if (filterCategory.value !== 'all') {
    links = links.filter(link => link.category === filterCategory.value)
  }

  // 排序
  links.sort((a, b) => {
    switch (sortBy.value) {
      case 'clicks':
        return b.clicks - a.clicks
      case 'title':
        return a.title.localeCompare(b.title)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  return links
})

// 方法
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || categoryId
}

const getCategoryStyle = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId)
  return {
    background: `${category?.color || '#6366f1'}20`,
    color: category?.color || '#6366f1',
    border: `1px solid ${category?.color || '#6366f1'}30`
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const exportReport = () => {
  const data = {
    exportTime: new Date().toISOString(),
    totalLinks: affLinks.length,
    totalClicks: totalClicks.value,
    categoryStats: categoryStats.value,
    links: sortedAndFilteredLinks.value.map(link => ({
      title: link.title,
      category: getCategoryName(link.category),
      clicks: link.clicks,
      createdAt: link.createdAt
    }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `aff-links-stats-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const refreshData = () => {
  // 重新加载统计数据
  const saved = localStorage.getItem('clickStats')
  if (saved) {
    clickStats.value = JSON.parse(saved)
  }
}

const viewLink = (link: AffLink) => {
  // 这里可以打开链接详情弹窗
  console.log('查看链接:', link.title)
}

const copyLink = async (link: AffLink) => {
  try {
    await navigator.clipboard.writeText(link.url)
    // 这里可以显示成功通知
  } catch (error) {
    console.error('复制失败:', error)
  }
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.stats-view {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 页面头部 */
.stats-view__header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: var(--space-xl) 0;
}

.stats-view__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.stats-view__title-group {
  margin-bottom: var(--space-lg);
}

.stats-view__title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
}

.stats-view__title i {
  color: var(--primary);
}

.stats-view__subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.stats-view__actions {
  display: flex;
  gap: var(--space-md);
}

/* 时间范围选择器 */
.time-range-selector {
  margin: var(--space-2xl) 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  font-weight: 600;
}

.section-title i {
  color: var(--primary);
}

.time-range-tabs {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.time-range-tab {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.time-range-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.time-range-tab--active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* 趋势图表 */
.trend-chart {
  margin: var(--space-2xl) 0;
}

.chart-container {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: var(--text-muted);
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.chart-placeholder p {
  font-size: 1.125rem;
  margin: 0 0 var(--space-xs) 0;
}

.chart-placeholder small {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 分类对比 */
.category-comparison {
  margin: var(--space-2xl) 0;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.comparison-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.comparison-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.comparison-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.comparison-card__header i {
  font-size: 1.5rem;
}

.comparison-card__header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.comparison-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.comparison-card__progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width var(--transition-slow);
}

/* 详细数据表 */
.detailed-table {
  margin: var(--space-2xl) 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.table-filters {
  display: flex;
  gap: var(--space-md);
}

.filter-select {
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.table-container {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: var(--bg-tertiary);
  padding: var(--space-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
}

.data-table td {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
}

.data-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.link-cell {
  min-width: 300px;
}

.link-info {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.link-info i {
  font-size: 1.25rem;
  margin-top: var(--space-xs);
}

.link-details {
  flex: 1;
}

.link-title {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.link-description {
  font-size: 0.875rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.clicks-value {
  font-weight: 600;
  color: var(--primary);
}

.actions-cell {
  display: flex;
  gap: var(--space-xs);
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--primary);
  color: white;
}

.table-empty {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-muted);
}

.table-empty i {
  font-size: 3rem;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.table-empty p {
  margin: 0;
  font-size: 1.125rem;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-view__container {
    padding: 0 var(--space-md);
  }

  .stats-view__title {
    font-size: 1.5rem;
  }

  .stats-view__actions {
    flex-direction: column;
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .table-filters {
    flex-direction: column;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .data-table {
    font-size: 0.875rem;
  }

  .link-cell {
    min-width: 200px;
  }

  .data-table th,
  .data-table td {
    padding: var(--space-sm);
  }
}

@media (max-width: 640px) {
  .comparison-card__stats {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .time-range-tabs {
    gap: var(--space-xs);
  }

  .time-range-tab {
    padding: var(--space-xs) var(--space-md);
    font-size: 0.875rem;
  }
}
</style>