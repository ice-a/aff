<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import * as naive from 'naive-ui'
const { NConfigProvider, NMessageProvider, NDialogProvider } = naive

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
