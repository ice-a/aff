<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar-inner container">
        <NuxtLink to="/" class="brand">
          <span class="brand-logo">卡</span>
          <span class="brand-name">流量卡优选中心</span>
        </NuxtLink>
        <nav class="nav">
          <NuxtLink to="/" class="nav-link">流量卡</NuxtLink>
          <NuxtLink to="/affiliate" class="nav-link">精选推荐</NuxtLink>
        </nav>
        <div class="actions">
          <NuxtLink to="/admin">
            <n-button>管理后台</n-button>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="main container">
      <slot />
    </main>

    <footer class="footer">
      <p>优选中心 · 聚合多平台优质资源，数据经 AI 提取与对比，办理请前往原平台</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.topbar-inner { height: 62px; display: flex; align-items: center; gap: 22px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--ink); }
.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.brand-name { font-size: 18px; }
.nav { display: flex; gap: 4px; margin-left: 8px; }
.nav-link {
  color: var(--ink-2);
  padding: 7px 14px;
  border-radius: 9px;
  font-weight: 600;
  transition: all 0.15s ease;
}
.nav-link:hover { background: #f1f5fb; }
.nav-link.router-link-active { color: var(--brand); background: #eef3ff; }
.actions { margin-left: auto; }
.main { flex: 1; padding-top: 22px; padding-bottom: 44px; }
.footer {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  padding: 22px;
  border-top: 1px solid var(--line);
}
</style>
