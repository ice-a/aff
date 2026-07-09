<template>
  <ClientOnly>
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider>
        <n-dialog-provider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
    <template #fallback>
      <div class="loading-screen">
        <p>加载中…</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const themeOverrides = {
  common: {
    primaryColor: '#3b6ef6',
    primaryColorHover: '#5b87f8',
    primaryColorPressed: '#2f59cc',
    borderRadius: '10px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
}
</script>

<style>
html,
body,
#__nuxt {
  height: 100%;
}
</style>
