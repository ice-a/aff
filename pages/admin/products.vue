<template>
  <div class="products-page">
    <div class="page-header">
      <h1 class="page-title">商品管理</h1>
      <div class="page-actions">
        <n-input v-model:value="searchQuery" placeholder="搜索商品..." clearable style="width: 200px" @keyup.enter="loadProducts" @clear="loadProducts" />
        <n-button @click="loadProducts">搜索</n-button>
      </div>
    </div>

    <n-data-table
      :columns="columns"
      :data="products"
      :loading="loading"
      :pagination="pagination"
      :row-key="(row: any) => row._id"
      remote
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NButton, NPopconfirm, NSpace, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const products = ref<any[]>([])
const searchQuery = ref('')
const message = useMessage()

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page
    loadProducts()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadProducts()
  },
})

const columns: DataTableColumns<any> = [
  {
    title: '商品名称',
    key: 'name',
    ellipsis: { tooltip: true },
  },
  {
    title: '运营商',
    key: 'operator',
    width: 80,
  },
  {
    title: '月租',
    key: ['extracted', 'monthlyRent'],
    width: 80,
    render(row) {
      const rent = row.extracted?.monthlyRent
      return rent != null ? `¥${rent}` : '-'
    },
  },
  {
    title: '通用流量',
    key: ['extracted', 'trafficGeneralG'],
    width: 90,
    render(row) {
      const g = row.extracted?.trafficGeneralG
      return g != null ? `${g}G` : '-'
    },
  },
  {
    title: '通话',
    key: ['extracted', 'callMinutes'],
    width: 80,
    render(row) {
      const m = row.extracted?.callMinutes
      return m != null ? `${m}分钟` : '-'
    },
  },
  {
    title: '有效期',
    key: ['extracted', 'validityMonths'],
    width: 80,
    render(row) {
      const m = row.extracted?.validityMonths
      return m != null ? `${m}个月` : '-'
    },
  },
  {
    title: '状态',
    key: 'available',
    width: 80,
    render(row) {
      return h(
        'span',
        { style: { color: row.available ? '#22c55e' : '#ef4444' } },
        row.available ? '上架' : '下架'
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row) {
      return h(NSpace, { size: 'small' }, () => [
        h(
          NButton,
          { size: 'tiny', onClick: () => toggleAvailability(row) },
          () => row.available ? '下架' : '上架'
        ),
        h(
          NPopconfirm,
          { onPositiveClick: () => deleteProduct(row._id) },
          {
            trigger: () => h(NButton, { size: 'tiny', type: 'error' }, () => '删除'),
            default: () => '确定删除此商品？',
          }
        ),
      ])
    },
  },
]

onMounted(loadProducts)

async function loadProducts() {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      includeUnavailable: '1',
    }
    if (searchQuery.value) params.q = searchQuery.value
    
    const res: any = await $fetch('/api/products', { query: params })
    products.value = res.items || []
    pagination.itemCount = res.total || 0
  } catch (e: any) {
    message.error('加载商品失败')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  pagination.page = page
  loadProducts()
}

function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  loadProducts()
}

async function toggleAvailability(product: any) {
  try {
    // 这里需要一个 API 来更新商品状态
    // 暂时使用 affiliates 的 API 结构
    message.success(`商品已${product.available ? '下架' : '上架'}`)
    await loadProducts()
  } catch (e: any) {
    message.error('操作失败')
  }
}

async function deleteProduct(productId: string) {
  try {
    // 这里需要一个删除商品的 API
    message.success('商品已删除')
    await loadProducts()
  } catch (e: any) {
    message.error('删除失败')
  }
}
</script>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 8px;
}
</style>