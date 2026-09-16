// 统一的链接统计数据管理（点击统计 + 最近访问）
// 作为模块级单例，保证 App / LinkDetail / QuickAccess 共享同一份响应式状态
import { ref, computed } from 'vue'

const STORAGE_KEYS = {
  clicks: 'clickStats',
  recent: 'recentVisits'
}

const RECENT_LIMIT = 20

const clickStats = ref<Record<string, number>>({})
const recentVisits = ref<string[]>([])
let initialized = false

function load() {
  if (initialized) return
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.clicks)
    if (saved) clickStats.value = JSON.parse(saved)
    const recent = localStorage.getItem(STORAGE_KEYS.recent)
    if (recent) recentVisits.value = JSON.parse(recent)
  } catch {
    // 数据损坏时忽略，使用默认值
  }
  initialized = true
}

function persist() {
  localStorage.setItem(STORAGE_KEYS.clicks, JSON.stringify(clickStats.value))
  localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recentVisits.value))
}

// 记录一次交互：点击数 +1，并把该链接提到最近访问首位（去重 + 限长）
function recordInteraction(id: string) {
  load()
  clickStats.value = {
    ...clickStats.value,
    [id]: (clickStats.value[id] || 0) + 1
  }
  recentVisits.value = [id, ...recentVisits.value.filter(v => v !== id)].slice(0, RECENT_LIMIT)
  persist()
}

function getClickCount(id: string): number {
  return clickStats.value[id] || 0
}

function clearStats() {
  clickStats.value = {}
  recentVisits.value = []
  localStorage.removeItem(STORAGE_KEYS.clicks)
  localStorage.removeItem(STORAGE_KEYS.recent)
}

const totalClicks = computed(() =>
  Object.values(clickStats.value).reduce((sum, n) => sum + n, 0)
)

export function useLinkStats() {
  load()
  return {
    clickStats,
    recentVisits,
    totalClicks,
    recordInteraction,
    getClickCount,
    clearStats
  }
}
