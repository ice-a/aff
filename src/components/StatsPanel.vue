<template>
  <div class="stats-panel">
    <!-- 统计卡片网格 -->
    <div class="stats-grid">
      <!-- 总链接数 -->
      <div class="stat-card stat-card--primary">
        <div class="stat-card__icon">
          <i class="fas fa-link"></i>
        </div>
        <div class="stat-card__content">
          <h3 class="stat-card__value">{{ totalLinks }}</h3>
          <p class="stat-card__label">总链接数</p>
          <div class="stat-card__trend">
            <i class="fas fa-arrow-up"></i>
            <span>持续增长</span>
          </div>
        </div>
      </div>

      <!-- 总点击量 -->
      <div class="stat-card stat-card--success">
        <div class="stat-card__icon">
          <i class="fas fa-mouse-pointer"></i>
        </div>
        <div class="stat-card__content">
          <h3 class="stat-card__value">{{ totalClicks }}</h3>
          <p class="stat-card__label">总点击量</p>
          <div class="stat-card__trend">
            <i class="fas fa-chart-line"></i>
            <span>活跃度</span>
          </div>
        </div>
      </div>

      <!-- 分类数量 -->
      <div class="stat-card stat-card--info">
        <div class="stat-card__icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="stat-card__content">
          <h3 class="stat-card__value">{{ categoryCount }}</h3>
          <p class="stat-card__label">分类数量</p>
          <div class="stat-card__trend">
            <i class="fas fa-layer-group"></i>
            <span>多样性</span>
          </div>
        </div>
      </div>

      <!-- 平均点击 -->
      <div class="stat-card stat-card--warning">
        <div class="stat-card__icon">
          <i class="fas fa-chart-bar"></i>
        </div>
        <div class="stat-card__content">
          <h3 class="stat-card__value">{{ averageClicks }}</h3>
          <p class="stat-card__label">平均点击</p>
          <div class="stat-card__trend">
            <i class="fas fa-balance-scale"></i>
            <span>均衡性</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类统计图表 -->
    <div class="stats-section">
      <h3 class="stats-section__title">
        <i class="fas fa-pie-chart"></i>
        分类分布
      </h3>
      <div class="category-stats">
        <div
          v-for="category in categoryStats"
          :key="category.id"
          class="category-stat"
        >
          <div class="category-stat__header">
            <div class="category-stat__info">
              <i :class="['fas', category.icon]" :style="{ color: category.color }"></i>
              <span class="category-stat__name">{{ category.name }}</span>
            </div>
            <span class="category-stat__count">{{ category.count }}个</span>
          </div>
          <div class="category-stat__bar">
            <div
              class="category-stat__progress"
              :style="{ width: category.percentage + '%', backgroundColor: category.color }"
            ></div>
          </div>
          <div class="category-stat__footer">
            <span class="category-stat__percentage">{{ category.percentage.toFixed(1) }}%</span>
            <span class="category-stat__clicks">{{ category.clicks }} 点击</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门链接排行 -->
    <div class="stats-section">
      <h3 class="stats-section__title">
        <i class="fas fa-fire"></i>
        热门排行
      </h3>
      <div class="popular-links">
        <div
          v-for="(link, index) in popularLinks"
          :key="link.id"
          class="popular-link"
        >
          <div class="popular-link__rank">
            <span :class="['rank-badge', getRankClass(index)]">{{ index + 1 }}</span>
          </div>
          <div class="popular-link__icon">
            <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
          </div>
          <div class="popular-link__info">
            <h4 class="popular-link__title">{{ link.title }}</h4>
            <p class="popular-link__category">{{ getCategoryName(link.category) }}</p>
          </div>
          <div class="popular-link__stats">
            <span class="popular-link__clicks">{{ link.clicks }} 次点击</span>
            <div class="popular-link__trend">
              <i class="fas fa-arrow-up"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间趋势 -->
    <div class="stats-section">
      <h3 class="stats-section__title">
        <i class="fas fa-clock"></i>
        最近活动
      </h3>
      <div class="activity-timeline">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-item__icon">
            <i :class="['fas', activity.icon]"></i>
          </div>
          <div class="activity-item__content">
            <p class="activity-item__text">{{ activity.text }}</p>
            <span class="activity-item__time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { affLinks, categories, type AffLink, type Category } from '../config/links.config'

// 点击统计数据
const clickStats = ref<Record<string, number>>({})

// 计算属性
const totalLinks = computed(() => affLinks.length)

const totalClicks = computed(() => {
  return Object.values(clickStats.value).reduce((sum, count) => sum + count, 0)
})

const categoryCount = computed(() => categories.length)

const averageClicks = computed(() => {
  const total = totalClicks.value
  const count = affLinks.filter(link => clickStats.value[link.id] > 0).length
  return count > 0 ? Math.round(total / count) : 0
})

const categoryStats = computed(() => {
  const stats = categories.map(category => {
    const categoryLinks = affLinks.filter(link => link.category === category.id)
    const categoryClicks = categoryLinks.reduce((sum, link) => {
      return sum + (clickStats.value[link.id] || 0)
    }, 0)

    return {
      ...category,
      count: categoryLinks.length,
      clicks: categoryClicks,
      percentage: totalLinks.value > 0 ? (categoryLinks.length / totalLinks.value) * 100 : 0
    }
  })

  return stats.sort((a, b) => b.count - a.count)
})

const popularLinks = computed(() => {
  return affLinks
    .map(link => ({
      ...link,
      clicks: clickStats.value[link.id] || 0
    }))
    .filter(link => link.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
})

const recentActivity = computed(() => {
  const activities = []
  const now = new Date()

  // 模拟最近活动数据
  activities.push({
    id: '1',
    icon: 'fa-plus-circle',
    text: `添加了新的链接: ${affLinks[0]?.title}`,
    time: '2小时前'
  })

  activities.push({
    id: '2',
    icon: 'fa-mouse-pointer',
    text: `${popularLinks.value[0]?.title || '某个链接'} 获得了新的点击`,
    time: '4小时前'
  })

  activities.push({
    id: '3',
    icon: 'fa-edit',
    text: '更新了分类信息',
    time: '1天前'
  })

  activities.push({
    id: '4',
    icon: 'fa-chart-line',
    text: '总点击量突破了新的里程碑',
    time: '2天前'
  })

  return activities
})

const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || categoryId
}

const getRankClass = (index: number): string => {
  if (index === 0) return 'rank-badge--gold'
  if (index === 1) return 'rank-badge--silver'
  if (index === 2) return 'rank-badge--bronze'
  return 'rank-badge--default'
}

onMounted(() => {
  const saved = localStorage.getItem('clickStats')
  if (saved) {
    clickStats.value = JSON.parse(saved)
  }
})
</script>

<style scoped>
.stats-panel {
  padding: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.stat-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card--primary {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
}

.stat-card--success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.stat-card--info {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
}

.stat-card--warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
}

.stat-card__icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
}

.stat-card--primary .stat-card__icon {
  color: var(--primary);
}

.stat-card--success .stat-card__icon {
  color: var(--success);
}

.stat-card--info .stat-card__icon {
  color: var(--accent);
}

.stat-card--warning .stat-card__icon {
  color: var(--warning);
}

.stat-card__content {
  flex: 1;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  line-height: 1;
}

.stat-card__label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-xs) 0;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stat-card__trend i {
  font-size: 0.75rem;
}

/* 统计区域 */
.stats-section {
  margin-bottom: var(--space-2xl);
}

.stats-section__title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  font-weight: 600;
}

.stats-section__title i {
  color: var(--primary);
}

/* 分类统计 */
.category-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.category-stat {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.category-stat__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.category-stat__info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.category-stat__name {
  font-weight: 500;
  color: var(--text-primary);
}

.category-stat__count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

.category-stat__bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.category-stat__progress {
  height: 100%;
  border-radius: 4px;
  transition: width var(--transition-slow);
}

.category-stat__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 热门链接 */
.popular-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.popular-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.popular-link:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.05);
}

.popular-link__rank {
  flex-shrink: 0;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
}

.rank-badge--gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-badge--silver {
  background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
}

.rank-badge--bronze {
  background: linear-gradient(135deg, #CD7F32, #B8860B);
}

.rank-badge--default {
  background: var(--primary);
}

.popular-link__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  font-size: 1.25rem;
}

.popular-link__info {
  flex: 1;
  min-width: 0;
}

.popular-link__title {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popular-link__category {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.popular-link__stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.popular-link__clicks {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.popular-link__trend {
  color: var(--success);
  font-size: 0.75rem;
}

/* 活动时间线 */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.activity-item {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary);
}

.activity-item__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary);
  border-radius: var(--radius-md);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.activity-item__content {
  flex: 1;
}

.activity-item__text {
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  font-weight: 500;
}

.activity-item__time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-panel {
    padding: var(--space-lg);
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .stat-card__value {
    font-size: 1.5rem;
  }

  .stat-card__icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .popular-link {
    gap: var(--space-sm);
  }

  .popular-link__title {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .category-stat__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .popular-link__stats {
    display: none;
  }

  .activity-item {
    flex-direction: column;
    gap: var(--space-sm);
  }
}
</style>