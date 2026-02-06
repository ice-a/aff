<template>
  <div class="quick-access">
    <button 
      class="quick-btn"
      @click="showQuickPanel = true"
      title="快速访问"
    >
      <i class="fas fa-bolt"></i>
    </button>
    
    <transition name="slide-left">
      <div v-if="showQuickPanel" class="quick-panel" @click.self="showQuickPanel = false">
        <div class="quick-panel-content">
          <div class="quick-header">
            <h3><i class="fas fa-bolt"></i> 快速访问</h3>
            <button class="close-btn" @click="showQuickPanel = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- 最近访问 -->
          <div class="quick-section">
            <h4><i class="fas fa-history"></i> 最近访问</h4>
            <div class="quick-links">
              <a 
                v-for="link in recentLinks" 
                :key="link.id"
                :href="link.url"
                target="_blank"
                class="quick-link"
              >
                <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
                <span>{{ link.title }}</span>
              </a>
              <p v-if="recentLinks.length === 0" class="empty-text">
                还没有访问记录
              </p>
            </div>
          </div>
          
          <!-- 热门点击 -->
          <div class="quick-section">
            <h4><i class="fas fa-fire"></i> 热门推荐</h4>
            <div class="quick-links">
              <a 
                v-for="link in popularLinks" 
                :key="link.id"
                :href="link.url"
                target="_blank"
                class="quick-link"
              >
                <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
                <span>{{ link.title }}</span>
                <span class="click-count">{{ link.clicks }}次</span>
              </a>
            </div>
          </div>
          
          <!-- 快捷操作 -->
          <div class="quick-actions">
            <button class="quick-action-btn" @click="exportData">
              <i class="fas fa-download"></i>
              <span>导出数据</span>
            </button>
            <button class="quick-action-btn" @click="clearStats">
              <i class="fas fa-trash-alt"></i>
              <span>清除统计</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { affLinks } from '../config/links.config'

const showQuickPanel = ref(false)
const recentVisits = ref<string[]>([])
const clickStats = ref<Record<string, number>>({})

const recentLinks = computed(() => {
  return recentVisits.value
    .map(id => affLinks.find(link => link.id === id))
    .filter(Boolean)
    .slice(0, 5)
})

const popularLinks = computed(() => {
  return affLinks
    .map(link => ({
      ...link,
      clicks: clickStats.value[link.id] || 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
})

const exportData = () => {
  const data = {
    links: affLinks,
    stats: clickStats.value,
    recent: recentVisits.value,
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `aff-links-backup-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearStats = () => {
  if (confirm('确定要清除所有统计数据吗？')) {
    localStorage.removeItem('clickStats')
    localStorage.removeItem('recentVisits')
    clickStats.value = {}
    recentVisits.value = []
  }
}

onMounted(() => {
  const stats = localStorage.getItem('clickStats')
  if (stats) {
    clickStats.value = JSON.parse(stats)
  }
  
  const recent = localStorage.getItem('recentVisits')
  if (recent) {
    recentVisits.value = JSON.parse(recent)
  }
})
</script>

<style scoped>
.quick-access {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 999;
}

.quick-btn {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: var(--gradient-3);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(79, 172, 254, 0.4);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-btn:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 6px 30px rgba(79, 172, 254, 0.6);
}

.quick-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.quick-panel-content {
  width: 380px;
  max-width: 90vw;
  height: 100%;
  background: var(--bg-secondary);
  padding: 1.5rem;
  overflow-y: auto;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
}

.quick-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.quick-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.quick-header h3 i {
  color: #fbbf24;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--text-primary);
}

.quick-section {
  margin-bottom: 1.5rem;
}

.quick-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.quick-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-4px);
}

.quick-link i {
  font-size: 1.25rem;
}

.quick-link span {
  flex: 1;
  font-weight: 500;
}

.click-count {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
}

.empty-text {
  color: var(--text-muted);
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.quick-action-btn i {
  font-size: 1.25rem;
}

.quick-action-btn span {
  font-size: 0.8rem;
}

/* 动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--transition-medium);
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
}

.slide-left-enter-from .quick-panel-content,
.slide-left-leave-to .quick-panel-content {
  transform: translateX(100%);
}

/* 响应式 */
@media (max-width: 640px) {
  .quick-access {
    right: 1rem;
    bottom: 1rem;
  }
  
  .quick-panel-content {
    width: 100%;
    max-width: 100%;
  }
}
</style>
