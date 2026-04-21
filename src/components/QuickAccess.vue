<template>
  <div class="quick-access">
    <!-- 触发按钮 -->
    <button
      class="quick-access__trigger"
      @click="togglePanel"
      :aria-label="showPanel ? '关闭快速访问' : '打开快速访问'"
    >
      <i :class="['fas', showPanel ? 'fa-times' : 'fa-bolt']"></i>
    </button>

    <!-- 快速访问面板 -->
    <Transition name="slide-in">
      <div v-if="showPanel" class="quick-access__panel">
        <div class="quick-access__header">
          <h3 class="quick-access__title">
            <i class="fas fa-bolt"></i>
            快速访问
          </h3>
          <button
            class="quick-access__close"
            @click="closePanel"
            aria-label="关闭面板"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="quick-access__content">
          <!-- 最近访问 -->
          <section class="quick-access__section">
            <h4 class="quick-access__section-title">
              <i class="fas fa-history"></i>
              最近访问
            </h4>
            <div class="quick-links">
              <a
                v-for="link in recentLinks"
                :key="link.id"
                :href="link.url"
                target="_blank"
                class="quick-link"
                @click="recordVisit(link)"
              >
                <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
                <span class="quick-link__title">{{ link.title }}</span>
                <span class="quick-link__category">{{ getCategoryName(link.category) }}</span>
              </a>
              <div v-if="recentLinks.length === 0" class="quick-links__empty">
                <i class="fas fa-inbox"></i>
                <span>暂无访问记录</span>
              </div>
            </div>
          </section>

          <!-- 热门推荐 -->
          <section class="quick-access__section">
            <h4 class="quick-access__section-title">
              <i class="fas fa-fire"></i>
              热门推荐
            </h4>
            <div class="quick-links">
              <a
                v-for="link in popularLinks"
                :key="link.id"
                :href="link.url"
                target="_blank"
                class="quick-link"
                @click="recordVisit(link)"
              >
                <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
                <div class="quick-link__info">
                  <span class="quick-link__title">{{ link.title }}</span>
                  <span class="quick-link__category">{{ getCategoryName(link.category) }}</span>
                </div>
                <span class="quick-link__count">{{ link.clicks }}次</span>
              </a>
            </div>
          </section>

          <!-- 快捷操作 -->
          <section class="quick-access__section">
            <h4 class="quick-access__section-title">
              <i class="fas fa-cog"></i>
              快捷操作
            </h4>
            <div class="quick-actions">
              <button class="quick-action" @click="exportData">
                <i class="fas fa-download"></i>
                <span>导出数据</span>
              </button>
              <button class="quick-action" @click="importData">
                <i class="fas fa-upload"></i>
                <span>导入数据</span>
              </button>
              <button class="quick-action" @click="clearStats">
                <i class="fas fa-trash-alt"></i>
                <span>清除统计</span>
              </button>
              <button class="quick-action" @click="showStats">
                <i class="fas fa-chart-bar"></i>
                <span>查看统计</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </Transition>

    <!-- 统计弹窗 -->
    <Transition name="fade">
      <div v-if="showStatsModal" class="stats-modal" @click="showStatsModal = false">
        <div class="stats-modal__content" @click.stop>
          <div class="stats-modal__header">
            <h3>访问统计</h3>
            <button class="stats-modal__close" @click="showStatsModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="stats-modal__body">
            <div class="stats-grid">
              <div class="stat-card">
                <i class="fas fa-link"></i>
                <div class="stat-info">
                  <span class="stat-value">{{ totalLinks }}</span>
                  <span class="stat-label">总链接数</span>
                </div>
              </div>
              <div class="stat-card">
                <i class="fas fa-mouse-pointer"></i>
                <div class="stat-info">
                  <span class="stat-value">{{ totalClicks }}</span>
                  <span class="stat-label">总点击量</span>
                </div>
              </div>
              <div class="stat-card">
                <i class="fas fa-history"></i>
                <div class="stat-info">
                  <span class="stat-value">{{ recentLinks.length }}</span>
                  <span class="stat-label">最近访问</span>
                </div>
              </div>
              <div class="stat-card">
                <i class="fas fa-fire"></i>
                <div class="stat-info">
                  <span class="stat-value">{{ popularLinks.length }}</span>
                  <span class="stat-label">热门推荐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { affLinks, categories, type AffLink } from '../config/links.config'

const showPanel = ref(false)
const showStatsModal = ref(false)
const recentVisits = ref<string[]>([])
const clickStats = ref<Record<string, number>>({})

// 计算属性
const recentLinks = computed(() => {
  return recentVisits.value
    .map(id => affLinks.find(link => link.id === id))
    .filter(Boolean)
    .slice(0, 8)
})

const popularLinks = computed(() => {
  return affLinks
    .map(link => ({
      ...link,
      clicks: clickStats.value[link.id] || 0
    }))
    .filter(link => link.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8)
})

const totalLinks = computed(() => affLinks.length)
const totalClicks = computed(() => Object.values(clickStats.value).reduce((sum, count) => sum + count, 0))

// 方法
const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const closePanel = () => {
  showPanel.value = false
}

const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || categoryId
}

const recordVisit = (link: AffLink) => {
  // 更新点击统计
  clickStats.value[link.id] = (clickStats.value[link.id] || 0) + 1
  localStorage.setItem('clickStats', JSON.stringify(clickStats.value))

  // 更新最近访问
  const index = recentVisits.value.indexOf(link.id)
  if (index > -1) {
    recentVisits.value.splice(index, 1)
  }
  recentVisits.value.unshift(link.id)
  recentVisits.value = recentVisits.value.slice(0, 10) // 最多保存10个
  localStorage.setItem('recentVisits', JSON.stringify(recentVisits.value))
}

const exportData = () => {
  const data = {
    links: affLinks,
    categories: categories,
    stats: clickStats.value,
    recent: recentVisits.value,
    exportTime: new Date().toISOString(),
    version: '1.0.0'
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `aff-links-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.stats) {
            clickStats.value = data.stats
            localStorage.setItem('clickStats', JSON.stringify(data.stats))
          }
          if (data.recent) {
            recentVisits.value = data.recent
            localStorage.setItem('recentVisits', JSON.stringify(data.recent))
          }
          alert('数据导入成功！')
        } catch (error) {
          alert('数据导入失败，请检查文件格式')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const clearStats = () => {
  if (confirm('确定要清除所有统计数据吗？此操作不可恢复。')) {
    localStorage.removeItem('clickStats')
    localStorage.removeItem('recentVisits')
    clickStats.value = {}
    recentVisits.value = []
  }
}

const showStats = () => {
  showStatsModal.value = true
  showPanel.value = false
}

// 点击外部关闭面板
const handleClickOutside = (e: MouseEvent) => {
  const panel = document.querySelector('.quick-access__panel')
  const trigger = document.querySelector('.quick-access__trigger')

  if (showPanel.value && panel && !panel.contains(e.target as Node) && !trigger?.contains(e.target as Node)) {
    showPanel.value = false
  }
}

onMounted(() => {
  // 加载数据
  const stats = localStorage.getItem('clickStats')
  if (stats) {
    clickStats.value = JSON.parse(stats)
  }

  const recent = localStorage.getItem('recentVisits')
  if (recent) {
    recentVisits.value = JSON.parse(recent)
  }

  // 事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.quick-access {
  position: fixed;
  right: var(--space-xl);
  bottom: var(--space-xl);
  z-index: 1000;
}

/* 触发按钮 */
.quick-access__trigger {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1001;
}

.quick-access__trigger:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-xl);
}

.quick-access__trigger:active {
  transform: scale(0.95);
}

/* 面板 */
.quick-access__panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 360px;
  max-width: calc(100vw - var(--space-xl) * 2);
  max-height: 60vh;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quick-access__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border);
  background: var(--bg-tertiary);
}

.quick-access__title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.quick-access__title i {
  color: var(--accent);
}

.quick-access__close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.quick-access__close:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.quick-access__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

.quick-access__section {
  margin-bottom: var(--space-xl);
}

.quick-access__section:last-child {
  margin-bottom: 0;
}

.quick-access__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-access__section-title i {
  color: var(--primary-light);
}

/* 快速链接 */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.quick-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.quick-link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-hover);
  transform: translateX(-2px);
}

.quick-link i {
  font-size: 1.125rem;
  width: 20px;
  text-align: center;
}

.quick-link__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.quick-link__title {
  font-weight: 500;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-link__category {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.quick-link__count {
  font-size: 0.75rem;
  color: var(--accent);
  background: rgba(6, 182, 212, 0.1);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-weight: 600;
}

.quick-links__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xl) var(--space-lg);
  color: var(--text-muted);
  text-align: center;
}

.quick-links__empty i {
  font-size: 2rem;
  opacity: 0.5;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.75rem;
}

.quick-action:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
}

.quick-action i {
  font-size: 1.25rem;
}

/* 统计弹窗 */
.stats-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-lg);
}

.stats-modal__content {
  width: 100%;
  max-width: 400px;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.stats-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border);
  background: var(--bg-tertiary);
}

.stats-modal__header h3 {
  margin: 0;
  color: var(--text-primary);
}

.stats-modal__close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.stats-modal__close:hover {
  color: var(--text-primary);
}

.stats-modal__body {
  padding: var(--space-lg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.stat-card i {
  font-size: 1.5rem;
  color: var(--primary-light);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 动画 */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all var(--transition-normal);
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .quick-access {
    right: var(--space-lg);
    bottom: var(--space-lg);
  }

  .quick-access__panel {
    width: calc(100vw - var(--space-lg) * 2);
    max-height: 70vh;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .quick-link {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }

  .quick-link__info {
    gap: var(--space-xs);
  }

  .quick-action {
    padding: var(--space-sm);
  }
}
</style>