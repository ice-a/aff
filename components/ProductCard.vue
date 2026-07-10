<template>
  <n-card
    class="pcard"
    :class="{ off: !product.available }"
    :bordered="false"
    hoverable
    @click="open"
  >
    <div class="pcard-img">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="p.name"
        class="pcard-img-el"
        @load="onImgLoad"
        @error="onImgError"
      />
      <span class="op-tag" :class="'op-' + opClass">{{ p.operator }}</span>
    </div>

    <h3 class="pcard-title">{{ p.name }}</h3>

    <div class="pcard-tags">
      <n-tag size="small" type="success" :bordered="false">
        月租 ¥{{ p.extracted?.monthlyRent ?? '?' }}
      </n-tag>
      <n-tag size="small" type="warning" :bordered="false">
        通用 {{ p.extracted?.trafficGeneralG ?? '?' }}G
      </n-tag>
      <n-tag v-if="p.extracted?.trafficDirectedG" size="small" type="info" :bordered="false">
        定向 {{ p.extracted.trafficDirectedG }}G
      </n-tag>
      <n-tag size="small" :bordered="false">
        通话 {{ p.extracted?.callMinutes ?? 0 }}分
      </n-tag>
    </div>

    <div class="pcard-info">
      <div class="info-row">
        <span class="info-label">有效期</span>
        <span class="info-value green">{{ validityText }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">年龄</span>
        <span class="info-value">{{ p.extracted?.ageMin ?? '?' }}-{{ p.extracted?.ageMax ?? '?' }}周岁</span>
      </div>
      <div class="info-row" v-if="p.extracted?.area">
        <span class="info-label">地区</span>
        <span class="info-value">{{ p.extracted.area }}</span>
      </div>
      <div class="info-row" v-if="p.extracted?.selectNumber">
        <span class="info-label">选号</span>
        <span class="info-value">支持</span>
      </div>
      <div class="info-row" v-if="p.extracted?.needPhoto">
        <span class="info-label">传照片</span>
        <span class="info-value">需要</span>
      </div>
    </div>

    <div v-if="p.extracted?.keywords?.length" class="pcard-kw">
      <n-tag v-for="kw in p.extracted.keywords" :key="kw" size="tiny" :bordered="false" round>
        {{ kw }}
      </n-tag>
    </div>

    <div v-if="p.taocan" class="pcard-desc">{{ p.taocan }}</div>

    <div class="pcard-foot">
      <n-button type="primary" block :disabled="!p.available" @click.stop="open">
        {{ p.available ? '立即办理' : '已下架' }}
      </n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import * as naive from 'naive-ui'
const { useMessage, NCard, NTag, NButton } = naive
const props = defineProps<{ product: any }>()
const p = computed(() => props.product)
const message = useMessage()

const OP_IMG: Record<string, string> = {
  '移动': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%230066cc'/%3E%3Cstop offset='100%25' stop-color='%230088ee'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='180' fill='url(%23g)'/%3E%3Ctext x='150' y='75' text-anchor='middle' fill='white' font-family='Arial,sans-serif' font-size='42' font-weight='bold'%3E%E7%A7%BB%E5%8A%A8%3C/text%3E%3Ctext x='150' y='120' text-anchor='middle' fill='rgba(255,255,255,0.8)' font-family='Arial,sans-serif' font-size='20'%3EChina Mobile%3C/text%3E%3C/svg%3E",
  '联通': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23e60012'/%3E%3Cstop offset='100%25' stop-color='%23ff3344'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='180' fill='url(%23g)'/%3E%3Ctext x='150' y='75' text-anchor='middle' fill='white' font-family='Arial,sans-serif' font-size='42' font-weight='bold'%3E%E8%81%94%E9%80%9A%3C/text%3E%3Ctext x='150' y='120' text-anchor='middle' fill='rgba(255,255,255,0.8)' font-family='Arial,sans-serif' font-size='20'%3EChina Unicom%3C/text%3E%3C/svg%3E",
  '电信': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2300a0e9'/%3E%3Cstop offset='100%25' stop-color='%2333bbff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='180' fill='url(%23g)'/%3E%3Ctext x='150' y='75' text-anchor='middle' fill='white' font-family='Arial,sans-serif' font-size='42' font-weight='bold'%3E%E7%94%B5%E4%BF%A1%3C/text%3E%3Ctext x='150' y='120' text-anchor='middle' fill='rgba(255,255,255,0.8)' font-family='Arial,sans-serif' font-size='20'%3EChina Telecom%3C/text%3E%3C/svg%3E",
  '广电': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23009944'/%3E%3Cstop offset='100%25' stop-color='%2333bb66'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='180' fill='url(%23g)'/%3E%3Ctext x='150' y='75' text-anchor='middle' fill='white' font-family='Arial,sans-serif' font-size='42' font-weight='bold'%3E%E5%B9%BF%E7%94%B5%3C/text%3E%3Ctext x='150' y='120' text-anchor='middle' fill='rgba(255,255,255,0.8)' font-family='Arial,sans-serif' font-size='20'%3EBN%3C/text%3E%3C/svg%3E",
  '': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'%3E%3Crect width='300' height='180' fill='%23f0f4f8'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%23999' font-family='Arial,sans-serif' font-size='36'%3E%E6%B5%81%E9%87%8F%E5%8D%A1%3C/text%3E%3C/svg%3E",
}

const fallback = OP_IMG[p.value.operator] || OP_IMG['']
const imgSrc = ref(p.imageUrl || fallback)
const imgLoaded = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function useFallback() {
  if (imgLoaded.value) return
  imgLoaded.value = true
  imgSrc.value = fallback
}

onMounted(() => {
  if (!p.value.imageUrl) { imgSrc.value = fallback; return }
  timer = setTimeout(useFallback, 3000)
})

onUnmounted(() => { if (timer) clearTimeout(timer) })

function onImgLoad() {
  imgLoaded.value = true
  if (timer) clearTimeout(timer)
}
function onImgError() {
  if (timer) clearTimeout(timer)
  useFallback()
}

const opClass = computed(() => {
  const o = p.value.operator
  return o === '移动' ? 'yd' : o === '联通' ? 'lt' : o === '电信' ? 'dx' : o === '广电' ? 'gd' : 'qt'
})
const validityText = computed(() => {
  const v = p.value.extracted?.validityText
  const m = p.value.extracted?.validityMonths
  if (v) return v
  if (m != null) return m >= 999 ? '长期有效' : m + '个月'
  return '待提取'
})
function open() {
  if (!p.value.available) {
    message.warning('该卡已下架')
    return
  }
  const u = p.value.buyUrl || p.value.shareUrl
  if (u) window.open(u, '_blank')
  else message.warning('暂无办理链接')
}
</script>

<style scoped>
.pcard { cursor: pointer; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.2s ease, transform 0.2s ease; }
.pcard:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
.pcard-img { position: relative; height: 140px; background: linear-gradient(135deg, #eef3ff, #e7fbf5); display: grid; place-items: center; overflow: hidden; }
.pcard-img-el { width: 100%; height: 100%; object-fit: cover; }
.op-tag { position: absolute; left: 10px; top: 10px; color: #fff; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.op-yd { background: var(--op-yd); } .op-lt { background: var(--op-lt); } .op-dx { background: var(--op-dx); } .op-gd { background: var(--op-gd); } .op-qt { background: var(--op-qt); }
.pcard-title { font-size: 15px; margin: 0 0 8px; line-height: 1.35; min-height: 36px; }
.pcard-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.pcard-info { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
.info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.info-label { color: var(--muted); min-width: 42px; }
.info-value { font-weight: 600; }
.info-value.green { color: #16a34a; }
.pcard-kw { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.pcard-desc { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pcard-foot { margin-top: auto; }
.pcard.off { opacity: 0.6; filter: grayscale(0.4); }
</style>
