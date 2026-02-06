<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <div class="header-content">
        <div class="logo">
          <i class="fas fa-link"></i>
          <span class="logo-text">AFF链接库</span>
        </div>
        
        <!-- 搜索栏 -->
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索链接..."
            @input="handleSearch"
          />
          <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 视图切换 -->
        <div class="view-toggle">
          <button 
            :class="['view-btn', { active: viewMode === 'grid' }]"
            @click="viewMode = 'grid'"
          >
            <i class="fas fa-th"></i>
          </button>
          <button 
            :class="['view-btn', { active: viewMode === 'list' }]"
            @click="viewMode = 'list'"
          >
            <i class="fas fa-list"></i>
          </button>
        </div>
        
        <!-- 统计信息 -->
        <div class="stats">
          <div class="stat-item">
            <i class="fas fa-mouse-pointer"></i>
            <span>总点击: {{ totalClicks }}</span>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 分类标签 -->
    <div class="category-nav" :class="{ sticky: isScrolled }">
      <div class="category-scroll">
        <button 
          :class="['category-btn', { active: selectedCategory === 'all' }]"
          @click="selectedCategory = 'all'"
        >
          <i class="fas fa-th-large"></i>
          <span>全部</span>
          <span class="count">{{ filteredLinks.length }}</span>
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: selectedCategory === category.id }]"
          @click="selectedCategory = category.id"
        >
          <i :class="['fas', category.icon]"></i>
          <span>{{ category.name }}</span>
          <span class="count">{{ getCategoryCount(category.id) }}</span>
        </button>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="displayedLinks.length === 0" class="empty-state">
        <i class="fas fa-search"></i>
        <h3>没有找到相关链接</h3>
        <p>尝试使用其他关键词搜索</p>
        <button class="btn-primary" @click="clearFilters">清除筛选</button>
      </div>
      
      <!-- 链接卡片网格 -->
      <div v-else :class="['links-container', viewMode]">
        <div 
          v-for="link in displayedLinks" 
          :key="link.id"
          class="link-card-wrapper"
        >
          <LinkCard 
            :link="link"
            :category="getCategory(link.category)"
            @click="handleCardClick(link)"
            @copy="copyLink(link)"
          />
        </div>
      </div>
    </main>
    
    <!-- 底部信息 -->
    <footer class="footer">
      <div class="footer-content">
        <p>
          <i class="fas fa-heart"></i>
          精心整理 | 共 {{ affLinks.length }} 个链接
        </p>
        <p class="update-time">最后更新: {{ lastUpdateTime }}</p>
      </div>
    </footer>
    
    <!-- 通知提示 -->
    <transition name="slide-up">
      <div v-if="notification.show" :class="['notification', notification.type]">
        <i :class="['fas', notification.icon]"></i>
        <span>{{ notification.message }}</span>
      </div>
    </transition>
    
    <!-- 详情弹窗 -->
    <transition name="fade">
      <div v-if="selectedLink" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
          <LinkDetail :link="selectedLink" :category="getCategory(selectedLink.category)" />
        </div>
      </div>
    </transition>
    
    <!-- 快速访问面板 -->
    <QuickAccess />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { affLinks, categories, type AffLink, type Category } from './config/links.config'
import LinkCard from './components/LinkCard.vue'
import LinkDetail from './components/LinkDetail.vue'
import QuickAccess from './components/QuickAccess.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const loading = ref(false)
const isScrolled = ref(false)
const selectedLink = ref<AffLink | null>(null)
const clickStats = ref<Record<string, number>>({})
const debouncedSearchQuery = ref('')
let searchTimeout: number | null = null

const notification = ref({
  show: false,
  message: '',
  type: 'success' as const,
  icon: 'fa-check-circle'
})

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = window.setTimeout(() => {
    debouncedSearchQuery.value = searchQuery.value
  }, 200)
}

const filteredLinks = computed(() => {
  let links = affLinks
  
  if (selectedCategory.value !== 'all') {
    links = links.filter(link => link.category === selectedCategory.value)
  }
  
  const query = debouncedSearchQuery.value.trim().toLowerCase()
  if (query) {
    links = links.filter(link => 
      link.title.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return links
})

const displayedLinks = computed(() => filteredLinks.value)

const totalClicks = computed(() => {
  return Object.values(clickStats.value).reduce((sum, count) => sum + count, 0)
})

const lastUpdateTime = computed(() => {
  const dates = affLinks.map(link => new Date(link.createdAt))
  const latest = new Date(Math.max(...dates.map(d => d.getTime())))
  return latest.toLocaleDateString('zh-CN')
})

const getCategory = (id: string): Category | undefined => {
  return categories.find(c => c.id === id)
}

const getCategoryCount = (categoryId: string): number => {
  return affLinks.filter(link => link.category === categoryId).length
}

const clearSearch = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
}

const clearFilters = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  selectedCategory.value = 'all'
}

const handleCardClick = (link: AffLink) => {
  clickStats.value[link.id] = (clickStats.value[link.id] || 0) + 1
  localStorage.setItem('clickStats', JSON.stringify(clickStats.value))
  selectedLink.value = link
}

const closeModal = () => {
  selectedLink.value = null
}

const copyLink = (link: AffLink) => {
  navigator.clipboard.writeText(link.url).then(() => {
    showNotification('链接已复制到剪贴板', 'success', 'fa-check-circle')
  }).catch(() => {
    showNotification('复制失败，请手动复制', 'error', 'fa-exclamation-circle')
  })
}

const showNotification = (message: string, type: 'success' | 'error' | 'info', icon: string) => {
  notification.value = { show: true, message, type, icon }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

let ticking = false
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 50
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  const saved = localStorage.getItem('clickStats')
  if (saved) {
    clickStats.value = JSON.parse(saved)
  }
  
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
  
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background: transparent;
  will-change: background-color, box-shadow;
}

.header.scrolled {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.logo i {
  font-size: 1.75rem;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text {
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-box {
  flex: 1;
  max-width: 500px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1rem;
}

.clear-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: var(--text-primary);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem;
  border-radius: 10px;
}

.view-btn {
  padding: 0.625rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  color: var(--text-primary);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stat-item i {
  color: var(--accent-color);
}

.category-nav {
  position: sticky;
  top: 80px;
  z-index: 100;
  padding: 1rem 2rem;
  transition: background-color 0.3s ease;
}

.category-nav.sticky {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
}

.category-scroll {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  max-width: 200px;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.category-btn.active {
  background: var(--gradient-1);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.category-btn .count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-top: 60px;
}

.links-container {
  max-width: 1600px;
  margin: 0 auto;
  contain: layout style;
}

.links-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.links-container.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
}

.link-card-wrapper {
  animation: simpleFadeIn 0.3s ease-out;
  will-change: opacity;
}

@keyframes simpleFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  gap: 1rem;
}

.loading-container p {
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
}

.empty-state i {
  font-size: 4rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.footer {
  padding: 2rem;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  text-align: center;
  color: var(--text-muted);
}

.footer-content i {
  color: var(--error-color);
  margin: 0 0.25rem;
}

.update-time {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 500;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 2000;
}

.notification.success {
  background: var(--success-color);
}

.notification.error {
  background: var(--error-color);
}

.notification.info {
  background: var(--info-color);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 700px;
  width: 100%;
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.modal-close:hover {
  transform: rotate(90deg);
}

@media (max-width: 1200px) {
  .header-content {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .search-box {
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .links-container.grid {
    grid-template-columns: 1fr;
  }
  
  .notification {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
  
  .category-nav {
    top: 70px;
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  
  .stats {
    display: none;
  }
}
</style>
