<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="brand">
          <span class="brand-logo">卡</span>
          <span class="brand-name">管理后台</span>
        </NuxtLink>
      </div>
      <nav class="sidebar-nav">
        <NuxtLink to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }">
          <span class="nav-icon">📊</span>
          <span class="nav-text">仪表盘</span>
        </NuxtLink>
        <NuxtLink to="/admin/sync" class="nav-item" :class="{ active: route.path === '/admin/sync' }">
          <span class="nav-icon">🔄</span>
          <span class="nav-text">数据同步</span>
        </NuxtLink>
        <NuxtLink to="/admin/products" class="nav-item" :class="{ active: route.path === '/admin/products' }">
          <span class="nav-icon">📦</span>
          <span class="nav-text">商品管理</span>
        </NuxtLink>
        <NuxtLink to="/admin/affiliates" class="nav-item" :class="{ active: route.path === '/admin/affiliates' }">
          <span class="nav-icon">🔗</span>
          <span class="nav-text">推荐管理</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="nav-item" :class="{ active: route.path === '/admin/settings' }">
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">系统设置</span>
        </NuxtLink>
      </nav>
      <div class="sidebar-footer">
        <NuxtLink to="/" class="nav-item">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">返回前台</span>
        </NuxtLink>
        <button class="nav-item logout-btn" @click="handleLogout">
          <span class="nav-icon">🚪</span>
          <span class="nav-text">退出登录</span>
        </button>
      </div>
    </aside>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (!localStorage.getItem('admin_password')) {
    router.push('/admin/login')
  }
})

function handleLogout() {
  localStorage.removeItem('admin_password')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 16px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.sidebar-nav {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background: #eef3ff;
  color: var(--brand);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  margin-top: 4px;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  padding: 24px;
  min-height: 100vh;
}
</style>