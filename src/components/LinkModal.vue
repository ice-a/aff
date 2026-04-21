<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal" @click.stop>
      <!-- 关闭按钮 -->
      <button class="modal__close" @click="handleClose" aria-label="关闭">
        <i class="fas fa-times"></i>
      </button>

      <!-- 模态框内容 -->
      <div class="modal__content">
        <!-- 头部信息 -->
        <header class="modal__header" :style="headerStyle">
          <div class="modal__header-overlay"></div>
          <div class="modal__header-content">
            <div class="modal__icon" :style="{ background: link.color }">
              <i :class="['fas', link.icon || 'fa-link']"></i>
            </div>
            <div class="modal__title-group">
              <h2 class="modal__title">{{ link.title }}</h2>
              <div class="modal__category" :style="{ color: category?.color }">
                <i :class="['fas', category?.icon || 'fa-tag']"></i>
                <span>{{ category?.name || link.category }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- 主体内容 -->
        <div class="modal__body">
          <!-- 描述信息 -->
          <section class="modal__section">
            <h3 class="modal__section-title">
              <i class="fas fa-info-circle"></i>
              简介
            </h3>
            <p class="modal__description">{{ link.description }}</p>
          </section>

          <!-- 佣金信息 -->
          <section class="modal__section modal__section--highlight">
            <h3 class="modal__section-title">
              <i class="fas fa-gift"></i>
              推广奖励
            </h3>
            <div class="commission-badge">
              <i class="fas fa-coins"></i>
              <span>{{ link.commission }}</span>
            </div>
          </section>

          <!-- 标签 -->
          <section class="modal__section">
            <h3 class="modal__section-title">
              <i class="fas fa-tags"></i>
              标签
            </h3>
            <div class="modal__tags">
              <span
                v-for="tag in link.tags"
                :key="tag"
                class="modal__tag"
              >
                {{ tag }}
              </span>
            </div>
          </section>

          <!-- 特性 -->
          <section class="modal__section">
            <h3 class="modal__section-title">
              <i class="fas fa-star"></i>
              产品特点
            </h3>
            <div class="modal__features">
              <div
                v-for="feature in link.features"
                :key="feature"
                class="feature-item"
              >
                <i class="fas fa-check-circle"></i>
                <span>{{ feature }}</span>
              </div>
            </div>
          </section>

          <!-- 链接信息 -->
          <section class="modal__section">
            <h3 class="modal__section-title">
              <i class="fas fa-link"></i>
              推广链接
            </h3>
            <div class="link-box">
              <code class="link-box__url">{{ link.url }}</code>
              <button class="link-box__copy" @click="copyToClipboard">
                <i :class="['fas', copied ? 'fa-check' : 'fa-copy']"></i>
                <span>{{ copied ? '已复制' : '复制' }}</span>
              </button>
            </div>
          </section>

          <!-- 元信息 -->
          <section class="modal__section">
            <div class="modal__meta">
              <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>添加时间：{{ formattedDate }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-mouse-pointer"></i>
                <span>点击次数：{{ clickCount }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- 操作按钮 -->
        <footer class="modal__footer">
          <button class="modal__btn modal__btn--primary" @click="visitLink">
            <i class="fas fa-external-link-alt"></i>
            <span>立即访问</span>
          </button>
          <button class="modal__btn modal__btn--secondary" @click="shareLink">
            <i class="fas fa-share-alt"></i>
            <span>分享</span>
          </button>
        </footer>
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

const emit = defineEmits<{
  (e: 'close'): void
}>()

const copied = ref(false)
const clickCount = ref(0)

// 头部背景样式
const headerStyle = computed(() => {
  const gradient = getRandomGradient(props.link.id)
  return {
    background: gradient
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

// 方法
const handleClose = () => {
  emit('close')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.link.url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
  }
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
    } catch (error) {
      // 如果分享失败，复制链接
      copyToClipboard()
    }
  } else {
    // 浏览器不支持Web Share API，复制链接
    copyToClipboard()
  }
}

onMounted(() => {
  const stats = JSON.parse(localStorage.getItem('clickStats') || '{}')
  clickCount.value = stats[props.link.id] || 0

  // 添加键盘事件监听
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  // 点击外部关闭
  const handleClickOutside = (e: MouseEvent) => {
    const modal = document.querySelector('.modal')
    if (modal && !modal.contains(e.target as Node)) {
      handleClose()
    }
  }

  // 延迟添加点击外部监听，避免立即触发
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 100)

  // 清理函数
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.modal-overlay {
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
  animation: fadeIn 0.3s ease-out;
}

.modal {
  position: relative;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.modal__close {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.modal__close:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
}

.modal__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

/* 头部 */
.modal__header {
  position: relative;
  padding: var(--space-2xl);
  min-height: 160px;
  display: flex;
  align-items: flex-end;
}

.modal__header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.modal__header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: var(--space-lg);
}

.modal__icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: var(--shadow-lg);
}

.modal__title-group {
  flex: 1;
}

.modal__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-sm);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal__category {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  opacity: 0.9;
}

/* 主体 */
.modal__body {
  flex: 1;
  padding: var(--space-2xl);
  overflow-y: auto;
}

.modal__section {
  margin-bottom: var(--space-xl);
}

.modal__section--highlight {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.modal__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-weight: 600;
}

.modal__section-title i {
  color: var(--primary);
  font-size: 1.125rem;
}

.modal__description {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.875rem;
}

.commission-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--gradient-warm);
  border-radius: var(--radius-md);
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.commission-badge i {
  font-size: 1.25rem;
}

.modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.modal__tag {
  padding: var(--space-sm) var(--space-md);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: var(--radius-full);
  color: var(--primary-light);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.modal__tag:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.modal__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-sm);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-item i {
  color: var(--success);
  font-size: 1rem;
}

.link-box {
  display: flex;
  gap: var(--space-sm);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  border: 1px solid var(--border);
}

.link-box__url {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: var(--space-xs) 0;
}

.link-box__copy {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.link-box__copy:hover {
  background: var(--primary-dark);
}

.modal__meta {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-muted);
  font-size: 0.875rem;
}

.meta-item i {
  color: var(--accent);
}

/* 底部操作 */
.modal__footer {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-2xl);
  border-top: 1px solid var(--border);
  background: var(--bg-tertiary);
}

.modal__btn {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
}

.modal__btn--primary {
  background: var(--gradient-primary);
  color: white;
}

.modal__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.modal__btn--secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.modal__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--space-md);
  }

  .modal__header {
    padding: var(--space-xl);
    min-height: 140px;
  }

  .modal__header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .modal__icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }

  .modal__title {
    font-size: 1.5rem;
  }

  .modal__body {
    padding: var(--space-xl);
  }

  .modal__features {
    grid-template-columns: 1fr;
  }

  .modal__meta {
    flex-direction: column;
    gap: var(--space-md);
  }

  .modal__footer {
    flex-direction: column;
    padding: var(--space-xl);
  }
}

@media (max-width: 480px) {
  .modal__close {
    top: var(--space-md);
    right: var(--space-md);
  }

  .link-box {
    flex-direction: column;
    gap: var(--space-md);
  }

  .link-box__url {
    white-space: normal;
    word-break: break-all;
  }
}
</style>