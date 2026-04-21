<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
      <div class="navbar__container">
        <!-- Logo区域 -->
        <div class="navbar__brand">
          <div class="logo">
            <i class="fas fa-link"></i>
            <span class="logo__text">AFF Hub</span>
          </div>
        </div>

        <!-- 搜索区域 -->
        <div class="navbar__search">
          <div class="search-box">
            <i class="fas fa-search search-box__icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索链接、标签或描述..."
              class="search-box__input"
              @input="handleSearch"
            />
            <button
              v-if="searchQuery"
              class="search-box__clear"
              @click="clearSearch"
              aria-label="清除搜索"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- 工具栏 -->
        <div class="navbar__tools">
          <!-- 视图切换 -->
          <div class="view-toggle">
            <button
              :class="['view-toggle__btn', { 'view-toggle__btn--active': viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
              aria-label="网格视图"
            >
              <i class="fas fa-th"></i>
            </button>
            <button
              :class="['view-toggle__btn', { 'view-toggle__btn--active': viewMode === 'list' }]"
              @click="viewMode = 'list'"
              aria-label="列表视图"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>

          <!-- 统计信息 -->
          <div class="stats">
            <div class="stat-item">
              <i class="fas fa-mouse-pointer"></i>
              <span>{{ totalClicks }} 点击</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 分类导航 -->
    <nav class="category-nav" :class="{ 'category-nav--sticky': isScrolled }">
      <div class="category-nav__container">
        <div class="category-tabs">
          <!-- 全部分类 -->
          <button
            :class="['category-tab', { 'category-tab--active': selectedCategory === 'all' }]"
            @click="selectedCategory = 'all'"
          >
            <i class="fas fa-th-large"></i>
            <span>全部</span>
            <span class="category-tab__count">{{ affLinks.length }}</span>
          </button>

          <!-- 具体分类 -->
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-tab', { 'category-tab--active': selectedCategory === category.id }]"
            @click="selectedCategory = category.id"
          >
            <i :class="['fas', category.icon]"></i>
            <span>{{ category.name }}</span>
            <span class="category-tab__count">{{ getCategoryCount(category.id) }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main">
      <div class="main__container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <span>正在加载链接...</span>
        </div>

        <!-- 空状态 -->
        <div v-else-if="filteredLinks.length === 0" class="empty-state">
          <i class="fas fa-search"></i>
          <h3>未找到匹配的链接</h3>
          <p>尝试使用不同的关键词或浏览其他分类</p>
          <button class="btn btn-primary" @click="clearFilters">
            <i class="fas fa-redo"></i>
            重置筛选条件
          </button>
        </div>

        <!-- 链接网格/列表 -->
        <div v-else :class="['links-container', `links-container--${viewMode}`]">
          <TransitionGroup name="staggered-fade">
            <LinkCard
              v-for="link in paginatedLinks"
              :key="link.id"
              :link="link"
              :category="getCategory(link.category)"
              :is-list-view="viewMode === 'list'"
              @click="openLinkDetail(link)"
              @copy="copyLink(link)"
            />
          </TransitionGroup>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              class="pagination__btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <div class="pagination__info">
              第 {{ currentPage }} 页，共 {{ totalPages }} 页
            </div>

            <button
              class="pagination__btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__content">
          <p class="footer__text">
            <i class="fas fa-heart" style="color: #ef4444"></i>
            精心整理的优质链接集合 | 共收录 {{ affLinks.length }} 个链接
          </p>
          <p class="footer__meta">
            最后更新：{{ lastUpdateTime }} | 总点击量：{{ totalClicks }}
          </p>
        </div>
      </div>
    </footer>

    <!-- 通知组件 -->
    <Transition name="slide-up">
      <div v-if="notification.show" :class="['notification', `notification--${notification.type}`]">
        <i :class="['fas', notification.icon]"></i>
        <span>{{ notification.message }}</span>
      </div>
    </Transition>

    <!-- 链接详情弹窗 -->
    <Transition name="fade">
      <LinkModal
        v-if="selectedLink"
        :link="selectedLink"
        :category="getCategory(selectedLink.category)"
        @close="closeLinkDetail"
      />
    </Transition>

    <!-- 快速访问面板 -->
    <QuickAccess />

    <!-- 回到顶部按钮 -->
    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { affLinks, categories, type AffLink, type Category } from './config/links.config'
import LinkCard from './components/LinkCard.vue'
import LinkModal from './components/LinkModal.vue'
import QuickAccess from './components/QuickAccess.vue'

// 响应式状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const loading = ref(false)
const isScrolled = ref(false)
const selectedLink = ref<AffLink | null>(null)
const currentPage = ref(1)
const itemsPerPage = 12
const showBackToTop = ref(false)

// 搜索和防抖
const debouncedSearchQuery = ref('')
let searchTimeout: number | null = null

// 点击统计
const clickStats = ref<Record<string, number>>({})

// 通知系统
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
  icon: 'fa-check-circle'
})

// 计算属性
const filteredLinks = computed(() => {
  let links = affLinks

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    links = links.filter(link => link.category === selectedCategory.value)
  }

  // 搜索筛选
  const query = debouncedSearchQuery.value.trim().toLowerCase()
  if (query) {
    links = links.filter(link =>
      link.title.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.tags.some(tag => tag.toLowerCase().includes(query)) ||
      link.category.toLowerCase().includes(query)
    )
  }

  return links
})

const totalPages = computed(() => {
  return Math.ceil(filteredLinks.value.length / itemsPerPage)
})

const paginatedLinks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLinks.value.slice(start, end)
})

const totalClicks = computed(() => {
  return Object.values(clickStats.value).reduce((sum, count) => sum + count, 0)
})

const lastUpdateTime = computed(() => {
  const dates = affLinks.map(link => new Date(link.createdAt))
  const latest = new Date(Math.max(...dates.map(d => d.getTime())))
  return latest.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 方法
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = window.setTimeout(() => {
    debouncedSearchQuery.value = searchQuery.value
    currentPage.value = 1 // 重置页码
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  selectedCategory.value = 'all'
  currentPage.value = 1
}

const getCategory = (id: string): Category | undefined => {
  return categories.find(c => c.id === id)
}

const getCategoryCount = (categoryId: string): number => {
  return affLinks.filter(link => link.category === categoryId).length
}

const openLinkDetail = (link: AffLink) => {
  // 记录点击
  clickStats.value[link.id] = (clickStats.value[link.id] || 0) + 1
  localStorage.setItem('clickStats', JSON.stringify(clickStats.value))

  selectedLink.value = link
}

const closeLinkDetail = () => {
  selectedLink.value = null
}

const copyLink = async (link: AffLink) => {
  try {
    await navigator.clipboard.writeText(link.url)
    showNotification('链接已复制到剪贴板', 'success', 'fa-check-circle')
  } catch (error) {
    showNotification('复制失败，请手动复制', 'error', 'fa-exclamation-circle')
  }
}

const showNotification = (message: string, type: 'success' | 'error' | 'info', icon: string) => {
  notification.value = { show: true, message, type, icon }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 滚动处理
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  showBackToTop.value = window.scrollY > 500
}

// 监听页码变化，滚动到顶部
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 生命周期
onMounted(() => {
  // 加载统计数据
  const saved = localStorage.getItem('clickStats')
  if (saved) {
    clickStats.value = JSON.parse(saved)
  }

  // 模拟加载
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)

  // 监听滚动
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
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--space-md) 0;
  transition: all var(--transition-normal);
  background: transparent;
}

.navbar--scrolled {
  background: var(--bg-overlay);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.navbar__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.navbar__brand {
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.logo i {
  font-size: 1.75rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo__text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar__search {
  flex: 1;
  max-width: 500px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box__icon {
  position: absolute;
  left: var(--space-md);
  color: var(--text-muted);
  font-size: 1rem;
  z-index: 1;
}

.search-box__input {
  width: 100%;
  padding: var(--space-md) var(--space-md) var(--space-md) calc(var(--space-md) * 3);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all var(--transition-normal);
}

.search-box__input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.search-box__clear {
  position: absolute;
  right: var(--space-sm);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: 50%;
  transition: color var(--transition-fast);
}

.search-box__clear:hover {
  color: var(--text-primary);
}

.navbar__tools {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.view-toggle {
  display: flex;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-xs);
  border: 1px solid var(--border);
}

.view-toggle__btn {
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  color: var(--text-muted);
  border-radius: calc(var(--radius-md) - var(--space-xs));
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-toggle__btn:hover {
  color: var(--text-primary);
}

.view-toggle__btn--active {
  background: var(--primary);
  color: white;
}

.stats {
  display: flex;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-secondary);
  font-size: 0.875rem;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.stat-item i {
  color: var(--accent);
}

/* 分类导航 */
.category-nav {
  position: sticky;
  top: 80px;
  z-index: 100;
  padding: var(--space-md) 0;
  background: transparent;
  transition: background var(--transition-normal);
}

.category-nav--sticky {
  background: var(--bg-overlay);
  backdrop-filter: blur(20px);
}

.category-nav__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  overflow-x: auto;
  padding-bottom: var(--space-xs);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.category-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.category-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.category-tab:hover::before {
  left: 100%;
}

.category-tab--active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.category-tab__count {
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

/* 主要内容 */
.main {
  flex: 1;
  padding-top: 140px;
}

.main__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-2xl);
}

.links-container {
  display: grid;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.links-container--grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.links-container--list {
  grid-template-columns: 1fr;
  max-width: 900px;
  margin: 0 auto;
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination__btn:hover:not(:disabled) {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* 页脚 */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.footer__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

.footer__content {
  text-align: center;
  color: var(--text-muted);
}

.footer__text {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.footer__meta {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 回到顶部 */
.back-to-top {
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: var(--shadow-xl);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar__container {
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .navbar__search {
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }

  .links-container--grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .main {
    padding-top: 160px;
  }

  .links-container--grid {
    grid-template-columns: 1fr;
  }

  .category-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: var(--space-md) 0;
  }

  .pagination {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .back-to-top {
    bottom: var(--space-lg);
    right: var(--space-lg);
  }
}

@media (max-width: 640px) {
  .navbar__tools .stats {
    display: none;
  }

  .logo__text {
    display: none;
  }

  .main__container {
    padding: 0 var(--space-md) var(--space-xl);
  }
}
</style>