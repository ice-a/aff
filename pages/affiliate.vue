<template>
  <div>
    <section class="hero">
      <h1>精选推荐</h1>
      <p>优质资源合集，分类整理，方便查找</p>
    </section>

    <div v-if="loading" class="sections">
      <n-card v-for="i in 3" :key="i" :bordered="false" class="skel">
        <n-skeleton height="28px" width="160px" style="margin-bottom: 16px" />
        <n-skeleton height="60px" :repeat="2" style="margin-bottom: 8px" />
      </n-card>
    </div>

    <n-empty v-else-if="!categories.length" description="暂无推荐内容" class="empty" />

    <div v-else class="sections">
      <section v-for="cat in categories" :key="cat._id" class="cat-section">
        <h2 class="cat-title">
          <span v-if="cat.icon" class="cat-icon">{{ cat.icon }}</span>
          {{ cat.name }}
        </h2>
        <div class="link-grid">
          <a
            v-for="link in cat.links"
            :key="link._id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-card"
          >
            <div class="link-info">
              <div class="link-name">
                <span class="link-icon">{{ getLinkIcon(link) }}</span>
                {{ link.name }}
              </div>
              <div v-if="link.description" class="link-desc">{{ link.description }}</div>
            </div>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as naive from 'naive-ui'
const { NCard, NSkeleton, NEmpty } = naive
const categories = ref<any[]>([])
const loading = ref(true)

const linkIcons = ['🚀', '⚡', '💎', '🔥', '✨', '🎯', '💰', '🎁', '🌟', '📱', '🔗', '📶', '💡', '🏆', '🎉']

function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function getLinkIcon(link: any) {
  if (link.icon) return link.icon
  return linkIcons[hashCode(link.name || link.url) % linkIcons.length]
}

async function load() {
  loading.value = true
  try {
    categories.value = await $fetch('/api/affiliates')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.sections { display: flex; flex-direction: column; gap: 28px; }
.cat-section { }
.cat-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cat-icon { font-size: 22px; }
.link-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 900px) {
  .link-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .link-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 400px) {
  .link-grid { grid-template-columns: 1fr; }
}
.link-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
  cursor: pointer;
}
.link-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
.link-info { flex: 1; min-width: 0; }
.link-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 6px;
}
.link-icon { font-size: 16px; }
.link-desc {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.link-arrow {
  color: var(--brand);
  font-size: 18px;
  font-weight: 700;
  margin-left: 12px;
  flex-shrink: 0;
}
.skel { border-radius: var(--radius); box-shadow: var(--shadow); }
.empty { padding: 60px 0; }
</style>
