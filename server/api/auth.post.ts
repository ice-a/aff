export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = body?.password

  if (!password) {
    throw createError({ statusCode: 400, message: '请输入密码' })
  }

  const config = useRuntimeConfig()

  if (password !== config.adminPassword) {
    throw createError({ statusCode: 401, message: '密码错误' })
  }

  return { ok: true }
})