<template>
  <div>
    <section class="hero">
      <div class="hero-icon">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="8" width="48" height="64" rx="8" fill="url(#grad)" />
          <path d="M40 28 L48 40 H32 L40 28Z" fill="#fff" opacity="0.9"/>
          <circle cx="40" cy="52" r="4" fill="#fff" opacity="0.7"/>
          <defs>
            <linearGradient id="grad" x1="16" y1="8" x2="64" y2="72">
              <stop offset="0%" stop-color="#3b6ef6"/>
              <stop offset="100%" stop-color="#7b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1>一张好卡，从这里开始</h1>
      <p>聚合多平台流量卡资源，AI 智能对比，帮你找到最划算的那张卡</p>
      <div class="hero-search">
        <n-input
          v-model:value="q"
          placeholder="搜索套餐 / 运营商 / 流量"
          clearable
          size="large"
          @keyup.enter="load"
          @clear="load"
        >
          <template #prefix>🔍</template>
          <template #suffix>
            <n-button text type="primary" @click="load">搜索</n-button>
          </template>
        </n-input>
      </div>
    </section>

    <div class="toolbar">
      <n-radio-group :value="operator" name="operator" @update:value="(v: string) => { operator = v; load() }">
        <n-radio-button value="">全部</n-radio-button>
        <n-radio-button value="移动">移动</n-radio-button>
        <n-radio-button value="联通">联通</n-radio-button>
        <n-radio-button value="电信">电信</n-radio-button>
        <n-radio-button value="广电">广电</n-radio-button>
      </n-radio-group>

      <n-select
        v-model:value="trafficRange"
        :options="trafficOptions"
        placeholder="通用流量"
        clearable
        style="width: 140px"
        @update:value="load"
      />
      <n-select
        v-model:value="validityRange"
        :options="validityOptions"
        placeholder="有效期"
        clearable
        style="width: 140px"
        @update:value="load"
      />
      <n-select
        v-model:value="callRange"
        :options="callOptions"
        placeholder="通话分钟"
        clearable
        style="width: 140px"
        @update:value="load"
      />
      <n-select
        v-model:value="sort"
        :options="sortOptions"
        style="width: 130px"
        @update:value="load"
      />
      <span class="count">共 {{ total }} 张</span>
    </div>

    <div v-if="loading" class="grid">
      <n-card v-for="i in 8" :key="i" :bordered="false" class="skel">
        <n-skeleton height="140px" />
        <n-skeleton text :repeat="3" style="margin-top: 12px" />
      </n-card>
    </div>
    <n-empty v-else-if="!items.length" description="暂无匹配的流量卡" class="empty" />
    <div v-else class="grid">
      <ProductCard v-for="it in items" :key="it._id" :product="it" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as naive from 'naive-ui'
const { NInput, NButton, NRadioGroup, NRadioButton, NSelect, NCard, NSkeleton, NEmpty } = naive
const q = ref('')
const operator = ref('')
const trafficRange = ref<string | null>(null)
const validityRange = ref<string | null>(null)
const callRange = ref<string | null>(null)
const sort = ref('')
const items = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

const trafficOptions = [
  { label: '不限', value: '' },
  { label: '50G 以下', value: '0-50' },
  { label: '50-100G', value: '50-100' },
  { label: '100-150G', value: '100-150' },
  { label: '150-200G', value: '150-200' },
  { label: '200G 以上', value: '200-9999' },
]
const validityOptions = [
  { label: '不限', value: '' },
  { label: '6 个月以下', value: '0-6' },
  { label: '6-12 个月', value: '6-12' },
  { label: '12-24 个月', value: '12-24' },
  { label: '长期有效', value: '24-9999' },
]
const callOptions = [
  { label: '不限', value: '' },
  { label: '无通话', value: '0-0' },
  { label: '100 分钟以内', value: '1-100' },
  { label: '100-300 分钟', value: '100-300' },
  { label: '300 分钟以上', value: '300-9999' },
]
const sortOptions = [
  { label: '最新上架', value: '' },
  { label: '有效期最长', value: 'validity' },
  { label: '流量最多', value: 'traffic' },
  { label: '月租最低', value: 'price' },
]

function parseRange(v: string | null) {
  if (!v) return {}
  const [min, max] = v.split('-').map(Number)
  return { min, max }
}

async function load() {
  loading.value = true
  try {
    const params: any = { page: 1, pageSize: 60, sort: sort.value }
    if (q.value) params.q = q.value
    if (operator.value) params.operator = operator.value
    const t = parseRange(trafficRange.value)
    if (t.min != null) params.trafficMin = t.min
    if (t.max != null) params.trafficMax = t.max
    const v = parseRange(validityRange.value)
    if (v.min != null) params.validityMin = v.min
    if (v.max != null) params.validityMax = v.max
    const c = parseRange(callRange.value)
    if (c.min != null) params.callMin = c.min
    if (c.max != null) params.callMax = c.max
    const res: any = await $fetch('/api/products', { query: params })
    items.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.hero-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  animation: float 3s ease-in-out infinite;
}
.hero-icon svg { width: 100%; height: 100%; filter: drop-shadow(0 8px 24px rgba(59,110,246,0.3)); }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.hero-search { max-width: 560px; }
.toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.count { color: var(--muted); font-size: 13px; margin-left: auto; }
.skel { border-radius: var(--radius); box-shadow: var(--shadow); }
.empty { padding: 60px 0; }
</style>
