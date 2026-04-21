<template>
  <article
    class="link-card"
    :class="{ 'link-card--list': isListView }"
    @click="handleClick"
  >
    <!-- 卡片背景 -->
    <div class="link-card__bg" :style="backgroundStyle">
      <div class="link-card__overlay"></div>
    </div>

    <!-- 卡片内容 -->
    <div class="link-card__content">
      <!-- 头部信息 -->
      <header class="link-card__header">
        <!-- 分类标签 -->
        <div class="category-badge" :style="categoryStyle">
          <i :class="['fas', category?.icon || 'fa-tag']"></i>
          <span>{{ category?.name || link.category }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="link-card__actions">
          <button
            class="action-btn"
            @click.stop="handleCopy"
            :title="copyTooltip"
            aria-label="复制链接"
          >
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </header>

      <!-- 主体内容 -->
      <div class="link-card__body">
        <!-- 图标和标题 -->
        <div class="link-card__info">
          <div class="link-card__icon" :style="iconStyle">
            <i :class="['fas', link.icon || 'fa-link']"></i>
          </div>

          <div class="link-card__title-group">
            <h3 class="link-card__title">{{ link.title }}</h3>
            <p class="link-card__description">{{ link.description }}</p>
          </div>
        </div>

        <!-- 标签 -->
        <div class="link-card__tags">
          <span
            v-for="tag in displayedTags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
          <span v-if="link.tags.length > 3" class="tag tag--more">
            +{{ link.tags.length - 3 }}
          </span>
        </div>

        <!-- 佣金信息 -->
        <div class="link-card__commission">
          <i class="fas fa-gift"></i>
          <span>{{ link.commission }}</span>
        </div>
      </div>

      <!-- 悬停时显示的特性 -->
      <div class="link-card__features">
        <div class="features-list">
          <div
            v-for="feature in displayedFeatures"
            :key="feature"
            class="feature-item"
          >
            <i class="fas fa-check-circle"></i>
            <span>{{ feature }}</span>
          </div>
        </div>

        <!-- 访问按钮 -->
        <button class="visit-btn" @click.stop="visitLink">
          <span>立即访问</span>
          <i class="fas fa-external-link-alt"></i>
        </button>
      </div>
    </div>
  </article>
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

// 计算样式
const categoryStyle = computed(() => ({
  background: `${props.category?.color || '#6366f1'}20`,
  color: props.category?.color || '#6366f1',
  border: `1px solid ${props.category?.color || '#6366f1'}30`
}))

const iconStyle = computed(() => ({
  background: `${props.link.color}15`,
  border: `1px solid ${props.link.color}30`
}))

const backgroundStyle = computed(() => {
  const gradient = getRandomGradient(props.link.id)
  return {
    background: gradient
  }
})

// 显示的内容
const displayedTags = computed(() => props.link.tags.slice(0, 3))
const displayedFeatures = computed(() => props.link.features.slice(0, 3))

const copyTooltip = computed(() => `复制 ${props.link.title} 的链接`)

// 方法
const handleClick = () => {
  emit('click')
}

const handleCopy = () => {
  emit('copy')
}

const visitLink = () => {
  window.open(props.link.url, '_blank')
  emit('click') // 同时触发点击统计
}
</script>

<style scoped>
.link-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  height: 320px;
  background: var(--bg-card);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-normal);
  isolation: isolate;
  will-change: transform;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.link-card--list {
  height: auto;
  min-height: 160px;
}

.link-card--list .link-card__features {
  display: none;
}

/* 背景 */
.link-card__bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.1;
  transition: opacity var(--transition-normal);
}

.link-card:hover .link-card__bg {
  opacity: 0.15;
}

.link-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.1) 0%,
    rgba(15, 23, 42, 0.4) 50%,
    rgba(15, 23, 42, 0.8) 100%
  );
}

/* 内容 */
.link-card__content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
}

/* 头部 */
.link-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.category-badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.link-card__actions {
  display: flex;
  gap: var(--space-xs);
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
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
  transform: scale(1.1);
}

/* 主体 */
.link-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.link-card__info {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.link-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-card__icon i {
  font-size: 1.5rem;
  color: var(--primary-light);
}

.link-card__title-group {
  flex: 1;
  min-width: 0;
}

.link-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-card__description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.tag {
  padding: var(--space-xs) var(--space-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.tag:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.tag--more {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.link-card__commission {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--gradient-warm);
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: auto;
}

.link-card__commission i {
  font-size: 1rem;
}

/* 特性（悬停显示） */
.link-card__features {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-lg);
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(15, 23, 42, 0.9) 70%,
    transparent 100%
  );
  opacity: 0;
  transform: translateY(20px);
  transition: all var(--transition-normal);
  pointer-events: none;
}

.link-card:hover .link-card__features {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-item i {
  color: var(--success);
  font-size: 0.875rem;
}

.visit-btn {
  width: 100%;
  padding: var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
}

.visit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 响应式 */
@media (max-width: 640px) {
  .link-card {
    height: 280px;
  }

  .link-card__content {
    padding: var(--space-md);
  }

  .link-card__title {
    font-size: 1.125rem;
  }

  .link-card__info {
    gap: var(--space-sm);
  }

  .link-card__icon {
    width: 40px;
    height: 40px;
  }

  .link-card__icon i {
    font-size: 1.25rem;
  }

  .link-card__features {
    padding: var(--space-md);
  }
}

@media (max-width: 480px) {
  .link-card:hover {
    transform: translateY(-4px);
  }

  .link-card__tags {
    gap: var(--space-xs);
  }

  .tag {
    font-size: 0.7rem;
    padding: var(--space-xs) var(--space-sm);
  }
}
</style>