<template>
  <div v-if="showSuggestions" class="search-suggestions">
    <!-- 搜索建议 -->
    <div class="suggestions-container">
      <!-- 热门搜索 -->
      <section v-if="hotSuggestions.length > 0" class="suggestion-section">
        <h4 class="suggestion-title">
          <i class="fas fa-fire"></i>
          热门搜索
        </h4>
        <div class="suggestion-list">
          <button
            v-for="suggestion in hotSuggestions"
            :key="suggestion"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <i class="fas fa-search"></i>
            <span>{{ suggestion }}</span>
          </button>
        </div>
      </section>

      <!-- 历史搜索 -->
      <section v-if="searchHistory.length > 0" class="suggestion-section">
        <div class="suggestion-header">
          <h4 class="suggestion-title">
            <i class="fas fa-history"></i>
            搜索历史
          </h4>
          <button class="clear-history" @click="clearHistory">
            <i class="fas fa-trash-alt"></i>
            清除
          </button>
        </div>
        <div class="suggestion-list">
          <button
            v-for="item in searchHistory"
            :key="item.query"
            class="suggestion-item suggestion-item--history"
            @click="selectSuggestion(item.query)"
          >
            <i class="fas fa-history"></i>
            <span>{{ item.query }}</span>
            <span class="search-count">{{ item.count }}次</span>
          </button>
        </div>
      </section>

      <!-- 匹配结果 -->
      <section v-if="matchingResults.length > 0" class="suggestion-section">
        <h4 class="suggestion-title">
          <i class="fas fa-link"></i>
          匹配的链接
        </h4>
        <div class="suggestion-list">
          <button
            v-for="link in matchingResults"
            :key="link.id"
            class="suggestion-item suggestion-item--link"
            @click="selectLink(link)"
          >
            <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
            <div class="link-info">
              <span class="link-title">{{ link.title }}</span>
              <span class="link-category">{{ getCategoryName(link.category) }}</span>
            </div>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      <!-- 标签建议 -->
      <section v-if="tagSuggestions.length > 0" class="suggestion-section">
        <h4 class="suggestion-title">
          <i class="fas fa-tags"></i>
          相关标签
        </h4>
        <div class="suggestion-list">
          <button
            v-for="tag in tagSuggestions"
            :key="tag.name"
            class="suggestion-item suggestion-item--tag"
            @click="selectSuggestion(tag.name)"
          >
            <i class="fas fa-tag"></i>
            <span>{{ tag.name }}</span>
            <span class="tag-count">{{ tag.count }}</span>
          </button>
        </div>
      </section>

      <!-- 空状态 -->
      <div v-if="isEmpty" class="suggestions-empty">
        <i class="fas fa-search"></i>
        <p>没有找到相关建议</p>
        <small>尝试使用其他关键词</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { affLinks, categories, type AffLink } from '../config/links.config'

interface Props {
  query: string
  show: boolean
  onSelect: (query: string) => void
  onSelectLink: (link: AffLink) => void
}

const props = defineProps<Props>()

// 搜索历史
const searchHistory = ref<Array<{ query: string; count: number; timestamp: number }>>([])

// 热门搜索建议
const hotSuggestions = ref<string[]>([
  'VPS',
  '云服务器',
  '数字货币',
  'VPN',
  'CDN',
  '域名',
  '开发工具',
  'Netflix'
])

// 计算属性
const showSuggestions = computed(() => props.show && (props.query || searchHistory.value.length > 0 || hotSuggestions.value.length > 0))

const matchingResults = computed(() => {
  if (!props.query.trim()) return []

  const query = props.query.toLowerCase()
  return affLinks
    .filter(link =>
      link.title.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.tags.some(tag => tag.toLowerCase().includes(query))
    )
    .slice(0, 5)
})

const tagSuggestions = computed(() => {
  if (!props.query.trim()) return []

  const query = props.query.toLowerCase()
  const tagCounts: Record<string, number> = {}

  // 统计标签出现次数
  affLinks.forEach(link => {
    link.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    })
  })

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

const isEmpty = computed(() => {
  return props.query && matchingResults.value.length === 0 && tagSuggestions.value.length === 0
})

// 方法
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || categoryId
}

const selectSuggestion = (query: string) => {
  addToHistory(query)
  props.onSelect(query)
}

const selectLink = (link: AffLink) => {
  addToHistory(link.title)
  props.onSelectLink(link)
}

const addToHistory = (query: string) => {
  const existingIndex = searchHistory.value.findIndex(item => item.query === query)

  if (existingIndex >= 0) {
    // 更新现有记录
    searchHistory.value[existingIndex].count++
    searchHistory.value[existingIndex].timestamp = Date.now()
    // 移到最前面
    const item = searchHistory.value.splice(existingIndex, 1)[0]
    searchHistory.value.unshift(item)
  } else {
    // 添加新记录
    searchHistory.value.unshift({
      query,
      count: 1,
      timestamp: Date.now()
    })
  }

  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }

  // 保存到本地存储
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  if (confirm('确定要清除所有搜索历史吗？')) {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }
}

// 点击外部关闭建议
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.search-suggestions') && !target.closest('.search-box')) {
    // 这里可以通过emit通知父组件关闭建议
  }
}

onMounted(() => {
  // 加载搜索历史
  const saved = localStorage.getItem('searchHistory')
  if (saved) {
    searchHistory.value = JSON.parse(saved)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-xs);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.suggestions-container {
  padding: var(--space-md);
}

.suggestion-section {
  margin-bottom: var(--space-lg);
}

.suggestion-section:last-child {
  margin-bottom: 0;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.suggestion-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 var(--space-md) 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestion-title i {
  color: var(--primary-light);
  font-size: 0.875rem;
}

.clear-history {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.clear-history:hover {
  color: var(--error);
  background: rgba(239, 68, 68, 0.1);
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  width: 100%;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.suggestion-item i {
  font-size: 0.875rem;
  color: var(--text-muted);
  width: 16px;
  text-align: center;
}

.suggestion-item--history {
  justify-content: space-between;
}

.suggestion-item--link {
  gap: var(--space-sm);
}

.link-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.link-title {
  font-weight: 500;
  font-size: 0.875rem;
}

.link-category {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.suggestion-item--tag {
  justify-content: space-between;
}

.search-count,
.tag-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

.suggestions-empty {
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  color: var(--text-muted);
}

.suggestions-empty i {
  font-size: 2rem;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.suggestions-empty p {
  margin: 0 0 var(--space-xs) 0;
  font-weight: 500;
}

.suggestions-empty small {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* 滚动条样式 */
.search-suggestions::-webkit-scrollbar {
  width: 4px;
}

.search-suggestions::-webkit-scrollbar-track {
  background: transparent;
}

.search-suggestions::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 2px;
}

.search-suggestions::-webkit-scrollbar-thumb:hover {
  background: var(--primary-light);
}

/* 响应式 */
@media (max-width: 640px) {
  .search-suggestions {
    max-height: 300px;
  }

  .suggestion-item {
    padding: var(--space-xs) var(--space-sm);
    gap: var(--space-sm);
  }

  .link-info {
    gap: var(--space-xs);
  }

  .link-title {
    font-size: 0.8rem;
  }

  .link-category {
    font-size: 0.7rem;
  }
}
</style>