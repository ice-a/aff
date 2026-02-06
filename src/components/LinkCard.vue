<template>
  <div 
    class="link-card"
    :class="{ 'list-view': isListView }"
    @click="$emit('click')"
  >
    <!-- 渐变背景 -->
    <div class="card-bg" :style="bgStyle">
      <div class="bg-overlay"></div>
    </div>
    
    <!-- 内容区 -->
    <div class="card-content">
      <!-- 头部 -->
      <div class="card-header">
        <div class="category-badge" :style="badgeStyle">
          <i :class="['fas', category?.icon || 'fa-tag']"></i>
          <span>{{ category?.name || link.category }}</span>
        </div>
        
        <div class="card-actions">
          <button 
            class="action-btn"
            @click.stop="$emit('copy')"
            title="复制链接"
          >
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
      
      <!-- 主体 -->
      <div class="card-body">
        <div class="icon-wrapper" :style="iconBgStyle">
          <i :class="['fas', link.icon || 'fa-link']" :style="{ color: link.color }"></i>
        </div>
        
        <h3 class="card-title">{{ link.title }}</h3>
        <p class="card-description">{{ link.description }}</p>
        
        <!-- 标签 -->
        <div class="tags">
          <span 
            v-for="tag in displayedTags" 
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
          <span v-if="link.tags.length > 3" class="tag more">
            +{{ link.tags.length - 3 }}
          </span>
        </div>
      </div>
      
      <!-- 悬停详情 -->
      <div class="card-details">
        <div class="detail-item commission">
          <i class="fas fa-gift"></i>
          <span>{{ link.commission }}</span>
        </div>
        
        <div class="features">
          <div 
            v-for="feature in displayedFeatures" 
            :key="feature"
            class="feature-item"
          >
            <i class="fas fa-check-circle"></i>
            <span>{{ feature }}</span>
          </div>
        </div>
        
        <button class="visit-btn" @click.stop="visitLink">
          <span>立即访问</span>
          <i class="fas fa-external-link-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AffLink, Category } from '../config/links.config'
import { getRandomGradient } from '../config/links.config'

interface Props {
  link: AffLink
  category?: Category
  isListView?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'copy'): void
}>()

// 预计算样式
const badgeStyle = computed(() => ({
  background: `${props.category?.color || '#6366f1'}20`,
  color: props.category?.color || '#6366f1'
}))

const iconBgStyle = computed(() => ({
  background: `${props.link.color}20`
}))

// 随机渐变背景 - 使用链接ID作为种子保持一致性
const bgStyle = computed(() => {
  const gradient = getRandomGradient(props.link.id)
  return {
    background: gradient,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

// 显示的标签（最多3个）
const displayedTags = computed(() => props.link.tags.slice(0, 3))

// 显示的特性（最多3个）
const displayedFeatures = computed(() => props.link.features.slice(0, 3))

const visitLink = () => {
  window.open(props.link.url, '_blank')
}
</script>

<style scoped>
.link-card {
  position: relative;
  border-radius: var(--card-radius);
  overflow: hidden;
  cursor: pointer;
  height: 380px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: var(--bg-card);
  will-change: transform;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.link-card.list-view {
  height: auto;
  min-height: 150px;
}

.link-card.list-view .card-details {
  display: none;
}

/* 背景图 - 移除动画 */
.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.3) 0%,
    rgba(15, 23, 42, 0.85) 50%,
    rgba(15, 23, 42, 0.95) 100%
  );
}

.link-card:hover .bg-overlay {
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.5) 0%,
    rgba(15, 23, 42, 0.95) 50%,
    rgba(15, 23, 42, 1) 100%
  );
}

/* 内容区 */
.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

/* 头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  max-width: 100%;
  word-break: break-word;
}

.category-badge i {
  font-size: 0.875rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--primary-color);
}

/* 主体 */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-wrapper i {
  font-size: 1.75rem;
}

.card-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.625rem;
  line-height: 1.3;
}

.card-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.tag.more {
  background: var(--primary-color);
  color: white;
}

/* 悬停详情 */
.card-details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 1) 0%,
    rgba(15, 23, 42, 0.98) 80%,
    transparent 100%
  );
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.link-card:hover .card-details {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.detail-item.commission {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.625rem 1rem;
  background: var(--gradient-5);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.detail-item.commission i {
  font-size: 1rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-item i {
  color: var(--success-color);
  font-size: 0.875rem;
}

.visit-btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  background: var(--gradient-1);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.visit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

/* 响应式 */
@media (max-width: 640px) {
  .link-card {
    height: 360px;
  }
  
  .card-content {
    padding: 1.25rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
  
  .card-details {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .link-card:hover {
    transform: translateY(-2px);
  }
}
</style>
