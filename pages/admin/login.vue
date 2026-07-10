<template>
  <div class="login-page">
    <n-card class="login-card" :bordered="false">
      <div class="login-header">
        <div class="login-logo">卡</div>
        <h1>管理员登录</h1>
        <p>请输入密码进入管理后台</p>
      </div>
      <n-form @submit.prevent="handleLogin">
        <n-form-item path="password">
          <n-input
            v-model:value="password"
            type="password"
            placeholder="请输入管理员密码"
            show-password-on="click"
            :disabled="loading"
            @keyup.enter="handleLogin"
          />
        </n-form-item>
        <n-button
          type="primary"
          block
          :loading="loading"
          :disabled="!password"
          @click="handleLogin"
        >
          登录
        </n-button>
      </n-form>
      <div class="login-footer">
        <NuxtLink to="/">← 返回首页</NuxtLink>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import naive from 'naive-ui'
const { useMessage, NCard, NForm, NFormItem, NInput, NButton } = naive

definePageMeta({
  layout: false,
})

const password = ref('')
const loading = ref(false)
const message = useMessage()
const router = useRouter()

onMounted(() => {
  if (localStorage.getItem('admin_password')) {
    router.push('/admin')
  }
})

async function handleLogin() {
  if (!password.value) return
  
  loading.value = true
  try {
    const res: any = await $fetch('/api/auth', {
      method: 'POST',
      body: { password: password.value },
    })
    
    if (res.ok) {
      localStorage.setItem('admin_password', password.value)
      message.success('登录成功')
      router.push('/admin')
    }
  } catch (e: any) {
    message.error(e?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
}
.login-card {
  width: 380px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
.login-header {
  text-align: center;
  margin-bottom: 32px;
}
.login-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 800;
}
.login-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--ink);
}
.login-header p {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}
.login-footer {
  text-align: center;
  margin-top: 24px;
}
.login-footer a {
  color: var(--brand);
  text-decoration: none;
  font-size: 14px;
}
.login-footer a:hover {
  text-decoration: underline;
}
</style>