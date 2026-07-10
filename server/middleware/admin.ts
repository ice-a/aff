export default defineEventHandler(async (event) => {
  // 只保护需要鉴权的 API
  const path = getRequestURL(event).pathname
  const method = event.method
  const needsAuth = (path === '/api/scrape' && method === 'POST')

  if (!needsAuth) return

  const config = useRuntimeConfig()
  const adminPassword = config.adminPassword

  // 从 header 获取密码
  const authPassword = getHeader(event, 'x-admin-password')

  if (!authPassword || authPassword !== adminPassword) {
    throw createError({ statusCode: 401, message: '未授权，请先登录' })
  }
})