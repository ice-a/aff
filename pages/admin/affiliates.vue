<template>
  <div class="affiliates-page">
    <div class="page-header">
      <h1 class="page-title">推荐管理</h1>
      <n-space>
        <n-button @click="showImportModal = true">
          导入 JSON
        </n-button>
        <n-button type="primary" @click="showCategoryModal = true">
          添加分类
        </n-button>
      </n-space>
    </div>

    <n-spin :show="loading">
      <div v-if="categories.length === 0 && !loading" class="empty-state">
        <n-empty description="暂无推荐分类" />
      </div>
      
      <div v-else class="categories-list">
        <n-card 
          v-for="category in categories" 
          :key="category._id" 
          :bordered="false" 
          class="category-card"
        >
          <template #header>
            <div class="category-header">
              <span class="category-name">{{ category.icon }} {{ category.name }}</span>
              <div class="category-actions">
                <n-button size="small" @click="editCategory(category)">编辑</n-button>
                <n-button size="small" type="primary" @click="showLinkModal(category._id)">添加链接</n-button>
                <n-popconfirm @positive-click="deleteCategory(category._id)">
                  <template #trigger>
                    <n-button size="small" type="error">删除</n-button>
                  </template>
                  确定删除此分类及所有链接？
                </n-popconfirm>
              </div>
            </div>
          </template>
          
          <div v-if="getLinksByCategory(category._id).length === 0" class="no-links">
            暂无链接
          </div>
          <div v-else class="links-list">
            <div v-for="link in getLinksByCategory(category._id)" :key="link._id" class="link-item">
              <div class="link-info">
                <span class="link-name">{{ link.name }}</span>
                <span class="link-url">{{ link.url }}</span>
                <span v-if="link.description" class="link-desc">{{ link.description }}</span>
              </div>
              <div class="link-actions">
                <n-button size="tiny" @click="editLink(link)">编辑</n-button>
                <n-popconfirm @positive-click="deleteLink(link._id)">
                  <template #trigger>
                    <n-button size="tiny" type="error">删除</n-button>
                  </template>
                  确定删除此链接？
                </n-popconfirm>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </n-spin>

    <!-- 分类编辑弹窗 -->
    <n-modal v-model:show="showCategoryModal" preset="dialog" :title="editingCategory ? '编辑分类' : '添加分类'" positive-text="确定" negative-text="取消" @positive-click="saveCategory" @negative-click="showCategoryModal = false">
      <n-form label-placement="left" label-width="60">
        <n-form-item label="名称">
          <n-input v-model:value="categoryForm.name" placeholder="分类名称" />
        </n-form-item>
        <n-form-item label="图标">
          <n-input v-model:value="categoryForm.icon" placeholder="Emoji 图标" />
        </n-form-item>
        <n-form-item label="排序">
          <n-input-number v-model:value="categoryForm.sort" :min="0" />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 链接编辑弹窗 -->
    <n-modal v-model:show="showLinkModalFlag" preset="dialog" :title="editingLink ? '编辑链接' : '添加链接'" positive-text="确定" negative-text="取消" @positive-click="saveLink" @negative-click="showLinkModalFlag = false">
      <n-form label-placement="left" label-width="60">
        <n-form-item label="名称">
          <n-input v-model:value="linkForm.name" placeholder="链接名称" />
        </n-form-item>
        <n-form-item label="URL">
          <n-input v-model:value="linkForm.url" placeholder="链接地址" />
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model:value="linkForm.description" placeholder="可选描述" />
        </n-form-item>
        <n-form-item label="排序">
          <n-input-number v-model:value="linkForm.sort" :min="0" />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 导入弹窗 -->
    <n-modal v-model:show="showImportModal" preset="dialog" title="导入 JSON 数据" positive-text="导入" negative-text="取消" :loading="importing" @positive-click="handleImport" @negative-click="showImportModal = false">
      <n-space vertical>
        <n-alert type="info" :bordered="false">
          <template #header>JSON 格式说明</template>
          <pre class="json-example">{{ importExample }}</pre>
        </n-alert>
        <n-input
          v-model:value="importJson"
          type="textarea"
          placeholder="请粘贴 JSON 数据..."
          :rows="12"
          spellcheck="false"
        />
        <n-text v-if="importError" type="error">{{ importError }}</n-text>
      </n-space>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import * as naive from 'naive-ui'
const { useMessage, NSpace, NButton, NSpin, NEmpty, NCard, NPopconfirm, NModal, NForm, NFormItem, NInput, NInputNumber, NAlert, NText } = naive

definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const categories = ref<any[]>([])
const links = ref<any[]>([])
const message = useMessage()

// 分类相关
const showCategoryModal = ref(false)
const editingCategory = ref<any>(null)
const categoryForm = ref({ name: '', icon: '', sort: 0 })

// 链接相关
const showLinkModalFlag = ref(false)
const editingLink = ref<any>(null)
const linkForm = ref({ name: '', url: '', description: '', sort: 0, categoryId: '' })

// 导入相关
const showImportModal = ref(false)
const importJson = ref('')
const importError = ref('')
const importing = ref(false)
const importExample = `[
  {
    "name": "热门推荐",
    "icon": "🔥",
    "sort": 0,
    "links": [
      { "name": "链接1", "url": "https://...", "description": "描述", "sort": 0 }
    ]
  }
]`

onMounted(async () => {
  await loadData()
})

function getAuthHeaders() {
  const password = localStorage.getItem('admin_password')
  return { 'x-admin-password': password || '' }
}

async function loadData() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/affiliates')
    // API 返回数组格式: [{...category, links: [...]}]
    if (Array.isArray(res)) {
      categories.value = res
      links.value = res.flatMap((cat: any) => 
        (cat.links || []).map((link: any) => ({ ...link, categoryId: cat._id }))
      )
    } else {
      categories.value = res.categories || []
      links.value = res.links || []
    }
  } catch (e: any) {
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

function getLinksByCategory(categoryId: string) {
  return links.value.filter(l => l.categoryId === categoryId)
}

// 分类操作
function editCategory(category: any) {
  editingCategory.value = category
  categoryForm.value = { name: category.name, icon: category.icon, sort: category.sort }
  showCategoryModal.value = true
}

async function saveCategory() {
  try {
    const token = localStorage.getItem('admin_token')
    if (editingCategory.value) {
      await $fetch('/api/affiliates', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: {
          action: 'updateCategory',
          categoryId: editingCategory.value._id,
          ...categoryForm.value,
        },
      })
      message.success('分类已更新')
    } else {
      await $fetch('/api/affiliates', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: { action: 'createCategory', ...categoryForm.value },
      })
      message.success('分类已创建')
    }
    showCategoryModal.value = false
    editingCategory.value = null
    categoryForm.value = { name: '', icon: '', sort: 0 }
    await loadData()
  } catch (e: any) {
    message.error(e?.data?.message || '操作失败')
  }
}

async function deleteCategory(categoryId: string) {
  try {
    await $fetch('/api/affiliates', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { action: 'deleteCategory', categoryId },
    })
    message.success('分类已删除')
    await loadData()
  } catch (e: any) {
    message.error(e?.data?.message || '删除失败')
  }
}

// 链接操作
function showLinkModal(categoryId: string) {
  editingLink.value = null
  linkForm.value = { name: '', url: '', description: '', sort: 0, categoryId }
  showLinkModalFlag.value = true
}

function editLink(link: any) {
  editingLink.value = link
  linkForm.value = { 
    name: link.name, 
    url: link.url, 
    description: link.description, 
    sort: link.sort, 
    categoryId: link.categoryId 
  }
  showLinkModalFlag.value = true
}

async function saveLink() {
  try {
    const token = localStorage.getItem('admin_token')
    if (editingLink.value) {
      await $fetch('/api/affiliates', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: {
          action: 'updateLink',
          linkId: editingLink.value._id,
          data: linkForm.value,
        },
      })
      message.success('链接已更新')
    } else {
      await $fetch('/api/affiliates', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: { action: 'addLink', ...linkForm.value },
      })
      message.success('链接已添加')
    }
    showLinkModalFlag.value = false
    editingLink.value = null
    linkForm.value = { name: '', url: '', description: '', sort: 0, categoryId: '' }
    await loadData()
  } catch (e: any) {
    message.error(e?.data?.message || '操作失败')
  }
}

async function deleteLink(linkId: string) {
  try {
    await $fetch('/api/affiliates', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { action: 'deleteLink', linkId },
    })
    message.success('链接已删除')
    await loadData()
  } catch (e: any) {
    message.error(e?.data?.message || '删除失败')
  }
}

// 导入功能
async function handleImport() {
  importError.value = ''
  if (!importJson.value.trim()) {
    importError.value = '请输入 JSON 数据'
    return false
  }

  let data: any[]
  try {
    data = JSON.parse(importJson.value)
  } catch {
    importError.value = 'JSON 格式错误，请检查语法'
    return false
  }

  if (!Array.isArray(data)) {
    importError.value = 'JSON 顶层必须是数组'
    return false
  }

  importing.value = true
  let created = 0
  try {
    for (const cat of data) {
      if (!cat.name) continue
      // 创建分类
      const catRes: any = await $fetch('/api/affiliates', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: {
          action: 'createCategory',
          name: cat.name,
          icon: cat.icon || '',
          sort: cat.sort || 0,
        },
      })
      const categoryId = catRes.category?._id
      if (!categoryId) continue

      // 创建链接
      for (const link of (cat.links || [])) {
        if (!link.name || !link.url) continue
        await $fetch('/api/affiliates', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: {
            action: 'addLink',
            categoryId,
            name: link.name,
            url: link.url,
            description: link.description || '',
            sort: link.sort || 0,
          },
        })
        created++
      }
    }
    message.success(`导入成功！共创建 ${data.length} 个分类，${created} 个链接`)
    showImportModal.value = false
    importJson.value = ''
    await loadData()
  } catch (e: any) {
    importError.value = '导入失败：' + (e?.data?.message || e.message)
    return false
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.affiliates-page {
  max-width: 1000px;
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

.empty-state {
  padding: 60px 0;
}

.category-card {
  border-radius: 12px;
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.no-links {
  color: #9ca3af;
  font-size: 14px;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.link-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.link-name {
  font-weight: 500;
  color: #1f2937;
}

.link-url {
  font-size: 12px;
  color: #6b7280;
  word-break: break-all;
}

.link-desc {
  font-size: 12px;
  color: #9ca3af;
}

.link-actions {
  display: flex;
  gap: 4px;
}

.json-example {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>