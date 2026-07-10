<template>
  <div class="sync-page">
    <h1 class="page-title">数据同步</h1>
    
    <n-card title="同步操作" :bordered="false" class="sync-card">
      <p class="sync-desc">点击按钮触发后台同步，同步在后台执行，完成后自动更新状态。</p>
      <n-space>
        <n-button 
          type="primary" 
          size="large" 
          :loading="submitting" 
          :disabled="submitting"
          @click="sync('platform1')"
        >
          {{ submitting ? '提交中...' : '同步畅行号卡' }}
        </n-button>
        <n-button 
          type="primary" 
          size="large" 
          :loading="submitting" 
          :disabled="submitting"
          @click="sync('platform2')"
        >
          {{ submitting ? '提交中...' : '同步木子号卡' }}
        </n-button>
        <n-button 
          size="large" 
          :loading="submitting" 
          :disabled="submitting"
          @click="sync('all')"
        >
          {{ submitting ? '提交中...' : '全部同步' }}
        </n-button>
      </n-space>
    </n-card>

    <n-card v-if="runningSync" title="同步进度" :bordered="false" class="progress-card">
      <div class="progress-content">
        <n-spin size="large" />
        <div class="progress-info">
          <p class="progress-text">{{ runningSyncText }}</p>
          <p class="progress-time">已等待 {{ elapsedText }}</p>
        </div>
      </div>
    </n-card>

    <n-card title="同步记录" :bordered="false" class="log-card">
      <n-spin :show="loadingLogs">
        <div v-if="logs.length === 0 && !loadingLogs" class="empty-state">
          <n-empty description="暂无同步记录" />
        </div>
        <div v-else class="log-list">
          <div v-for="log in logs" :key="log._id" class="log-item">
            <div class="log-header">
              <div class="log-title">
                <n-tag :type="getStatusType(log.status)" size="small">
                  {{ getStatusLabel(log.status) }}
                </n-tag>
                <span class="log-platform">{{ getPlatformLabel(log.platform) }}</span>
                <span class="log-type">{{ log.type === 'scheduled' ? '定时' : '手动' }}</span>
              </div>
              <span class="log-time">{{ formatTime(log.startedAt) }}</span>
            </div>
            <div class="log-content">
              <template v-if="log.status === 'running'">
                <div class="log-running">
                  <n-spin size="small" />
                  <span>同步中...</span>
                </div>
              </template>
              <template v-else-if="log.status === 'failed'">
                <span class="log-error">{{ log.results?.[0]?.error || '未知错误' }}</span>
              </template>
              <template v-else>
                <div class="log-results">
                  <div v-for="(r, i) in log.results?.filter((r: any) => r.platformName)" :key="i" class="log-result-row">
                    <span class="result-platform">{{ r.platformName }}</span>
                    <span class="result-stat">抓取 {{ r.fetched }}</span>
                    <span class="result-stat new">新增 {{ r.inserted }}</span>
                    <span class="result-stat update">更新 {{ r.updated }}</span>
                    <span v-if="r.expiredDeleted" class="result-stat clean">清理 {{ r.expiredDeleted }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import naive from 'naive-ui'
const { useMessage, NCard, NSpace, NButton, NSpin, NEmpty, NTag } = naive

definePageMeta({
  layout: 'admin',
})

const submitting = ref(false)
const loadingLogs = ref(false)
const logs = ref<any[]>([])
const runningSync = ref<any>(null)
const elapsedSeconds = ref(0)
const message = useMessage()
let pollTimer: ReturnType<typeof setInterval> | null = null
let elapsedTimer: ReturnType<typeof setInterval> | null = null

const runningSyncText = computed(() => {
  if (!runningSync.value) return ''
  const platformMap: Record<string, string> = {
    platform1: '畅行号卡',
    platform2: '木子号卡',
    all: '全部平台',
  }
  return `正在同步 ${platformMap[runningSync.value.platform] || runningSync.value.platform}...`
})

const elapsedText = computed(() => {
  const min = Math.floor(elapsedSeconds.value / 60)
  const sec = elapsedSeconds.value % 60
  return `${min}分${sec.toString().padStart(2, '0')}秒`
})

onMounted(async () => {
  await loadLogs()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  stopPolling()
  elapsedSeconds.value = 0
  elapsedTimer = setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
  pollTimer = setInterval(checkSyncStatus, 60000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

async function checkSyncStatus() {
  if (!runningSync.value) return
  
  try {
    const res: any = await $fetch('/api/sync-status', { query: { limit: 5 } })
    const logsData = res.logs || []
    logs.value = logsData
    
    const currentLog = logsData.find((l: any) => l._id === runningSync.value?._id)
    if (currentLog && currentLog.status !== 'running') {
      runningSync.value = null
      stopPolling()
      if (currentLog.status === 'success') {
        message.success('同步完成！')
      } else {
        message.error('同步失败：' + (currentLog.results?.[0]?.error || '未知错误'))
      }
    }
  } catch {}
}

async function loadLogs() {
  try {
    const res: any = await $fetch('/api/sync-status', { query: { limit: 10 } })
    logs.value = res.logs || []
    
    const running = logs.value.find((l: any) => l.status === 'running')
    if (running && !runningSync.value) {
      runningSync.value = running
      startPolling()
    } else if (!running) {
      runningSync.value = null
    }
  } catch {}
}

async function sync(platform: 'platform1' | 'platform2' | 'all') {
  submitting.value = true
  try {
    const password = localStorage.getItem('admin_password')
    const res: any = await $fetch('/api/scrape', { 
      method: 'POST',
      headers: { 'x-admin-password': password || '' },
      body: { platform, type: 'manual' },
    })
    
    runningSync.value = {
      _id: res.syncId,
      platform,
      status: 'running',
      startedAt: new Date().toISOString(),
    }
    startPolling()
    message.info('同步任务已提交，正在后台执行...')
    
    await loadLogs()
  } catch (e: any) {
    message.error('提交失败：' + (e?.data?.message || e.message))
  } finally {
    submitting.value = false
  }
}

function getStatusType(status: string) {
  const map: Record<string, 'success' | 'error' | 'info' | 'warning'> = {
    success: 'success',
    failed: 'error',
    running: 'info',
  }
  return map[status] || 'info'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    success: '完成',
    failed: '失败',
    running: '同步中',
  }
  return map[status] || status
}

function getPlatformLabel(platform: string) {
  const map: Record<string, string> = {
    platform1: '畅行号卡',
    platform2: '木子号卡',
    all: '全部平台',
  }
  return map[platform] || platform
}

function formatTime(date: string) {
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.sync-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px;
}

.sync-card {
  border-radius: 12px;
  margin-bottom: 16px;
}

.sync-desc {
  color: #6b7280;
  margin: 0 0 16px;
}

.progress-card {
  border-radius: 12px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.progress-info {
  flex: 1;
}

.progress-text {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
}

.progress-time {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.log-card {
  border-radius: 12px;
}

.empty-state {
  padding: 40px 0;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  background: #f9fafb;
  border-radius: 10px;
  padding: 14px 16px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-platform {
  font-weight: 600;
  color: #1f2937;
}

.log-type {
  font-size: 12px;
  color: #9ca3af;
}

.log-time {
  font-size: 12px;
  color: #9ca3af;
}

.log-content {
  font-size: 13px;
  color: #6b7280;
}

.log-running {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
}

.log-error {
  color: #ef4444;
}

.log-results {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-result-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.result-platform {
  font-weight: 500;
  color: #374151;
  min-width: 80px;
}

.result-stat {
  color: #6b7280;
}

.result-stat.new {
  color: #22c55e;
}

.result-stat.update {
  color: #f59e0b;
}

.result-stat.clean {
  color: #9ca3af;
}
</style>