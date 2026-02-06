<template>
  <div class="link-detail">
    <!-- 头部信息 -->
    <div class="detail-header" :style="headerStyle">
      <div class="detail-overlay"></div>
      <div class="detail-header-content">
        <div class="detail-icon" :style="{ background: link.color }">
          <i :class="['fas', link.icon || 'fa-link']"></i>
        </div>
        <div class="detail-title-group">
          <h2>{{ link.title }}</h2>
          <div class="detail-category" :style="{ color: category?.color }">
            <i :class="['fas', category?.icon || 'fa-tag']"></i>
            <span>{{ category?.name || link.category }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 内容区 -->
    <div class="detail-body">
      <!-- 描述 -->
      <div class="detail-section">
        <h3><i class="fas fa-info-circle"></i> 简介</h3>
        <p class="detail-description">{{ link.description }}</p>
      </div>
      
      <!-- 佣金信息 -->
      <div class="detail-section commission-section">
        <h3><i class="fas fa-gift"></i> 推广奖励</h3>
        <div class="commission-badge">
          <i class="fas fa-coins"></i>
          <span>{{ link.commission }}</span>
        </div>
      </div>
      
      <!-- 标签 -->
      <div class="detail-section">
        <h3><i class="fas fa-tags"></i> 标签</h3>
        <div class="detail-tags">
          <span 
            v-for="tag in link.tags" 
            :key="tag"
            class="detail-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      
      <!-- 特性 -->
      <div class="detail-section">
        <h3><i class="fas fa-star"></i> 产品特点</h3>
        <div class="detail-features">
          <div 
            v-for="feature in link.features" 
            :key="feature"
            class="detail-feature-item"
          >
            <i class="fas fa-check-circle"></i>
            <span>{{ feature }}</span>
          </div>
        </div>
      </div>
      
      <!-- 链接信息 -->
      <div class="detail-section">
        <h3><i class="fas fa-link"></i> 推广链接</h3>
        <div class="link-box">
          <code class="link-url">{{ link.url }}</code>
          <button class="copy-link-btn" @click="copyToClipboard">
            <i class="fas" :class="copied ? 'fa-check' : 'fa-copy'"></i>
            <span>{{ copied ? '已复制' : '复制' }}</span>
          </button>
        </div>
      </div>
      
      <!-- 时间信息 -->
      <div class="detail-meta">
        <div class="meta-item">
          <i class="fas fa-calendar-alt"></i>
          <span>添加时间: {{ formattedDate }}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-eye"></i>
          <span>点击次数: {{ clickCount }}</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="detail-actions">
        <button class="action-btn primary" @click="visitLink">
          <i class="fas fa-external-link-alt"></i>
          <span>立即访问</span>
        </button>
        <button class="action-btn secondary" @click="shareLink">
          <i class="fas fa-share-alt"></i>
          <span>分享</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { AffLink, Category } from '../config/links.config'
import { getRandomGradient } from '../config/links.config'

interface Props {
  link: AffLink
  category?: Category
}

const props = defineProps<Props>()

const copied = ref(false)
const clickCount = ref(0)

// 头部背景 - 使用渐变色
const headerStyle = computed(() => {
  const gradient = getRandomGradient(props.link.id)
  return {
    background: gradient,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(props.link.createdAt)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.link.url).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

const visitLink = () => {
  window.open(props.link.url, '_blank')
  // 记录点击
  const stats = JSON.parse(localStorage.getItem('clickStats') || '{}')
  stats[props.link.id] = (stats[props.link.id] || 0) + 1
  localStorage.setItem('clickStats', JSON.stringify(stats))
  clickCount.value = stats[props.link.id]
}

const shareLink = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.link.title,
        text: props.link.description,
        url: props.link.url
      })
    } catch (err) {
      console.log('分享取消')
    }
  } else {
    // 复制链接
    copyToClipboard()
  }
}

onMounted(() => {
  const stats = JSON.parse(localStorage.getItem('clickStats') || '{}')
  clickCount.value = stats[props.link.id] || 0
})
</script>

<style scoped>
.link-detail {
  background: var(--bg-secondary);
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
}

/* 头部 */
.detail-header {
  position: relative;
  padding: 2.5rem;
  min-height: 180px;
  display: flex;
  align-items: flex-end;
}

.detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.2) 0%,
    rgba(15, 23, 42, 0.85) 100%
  );
}

.detail-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
}

.detail-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.detail-title-group h2 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.detail-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

/* 内容区 */
.detail-body {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 1.75rem;
}

.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.875rem;
  font-weight: 600;
}

.detail-section h3 i {
  color: var(--primary-color);
}

.detail-description {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.95rem;
}

/* 佣金区域 */
.commission-section {
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%);
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(250, 112, 154, 0.2);
}

.commission-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  background: var(--gradient-5);
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
}

.commission-badge i {
  font-size: 1.25rem;
}

/* 标签 */
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.detail-tag {
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 50px;
  color: var(--primary-color);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.detail-tag:hover {
  background: var(--primary-color);
  color: white;
}

/* 特性 */
.detail-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-feature-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.detail-feature-item i {
  color: var(--success-color);
  font-size: 1rem;
}

/* 链接框 */
.link-box {
  display: flex;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 0.875rem;
  border: 1px solid var(--border-color);
}

.link-url {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-link-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.copy-link-btn:hover {
  background: var(--secondary-color);
}

/* 元信息 */
.detail-meta {
  display: flex;
  gap: 2rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.meta-item i {
  color: var(--accent-color);
}

/* 操作按钮 */
.detail-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  transition: all var(--transition-fast);
}

.action-btn.primary {
  background: var(--gradient-1);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 响应式 */
@media (max-width: 640px) {
  .detail-header {
    padding: 1.5rem;
    min-height: 150px;
  }
  
  .detail-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .detail-icon {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }
  
  .detail-title-group h2 {
    font-size: 1.5rem;
  }
  
  .detail-body {
    padding: 1.5rem;
  }
  
  .detail-features {
    grid-template-columns: 1fr;
  }
  
  .detail-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}
</style>
