import { connectDB } from '../../utils/mongo'
import { SyncLogModel } from '../../models/sync-log'
import { scrapeAll } from '../../services/scraper'
import { deleteExpired } from '../../services/cleanup'

export default defineEventHandler(async (event) => {
  // 验证 Vercel Cron 密钥
  const authHeader = getHeader(event, 'authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, message: '未授权' })
  }

  await connectDB()

  // 创建同步日志
  const log = await SyncLogModel.create({
    type: 'scheduled',
    platform: 'all',
    status: 'running',
    startedAt: new Date(),
  })

  // 后台异步执行
  const syncId = log._id.toString()
  runScheduledSync(syncId).catch(() => {})

  return { ok: true, syncId, message: '定时同步已开始' }
})

async function runScheduledSync(syncId: string) {
  try {
    const results = await scrapeAll()

    let expiredDeleted = 0
    try {
      expiredDeleted = await deleteExpired()
    } catch {}

    await SyncLogModel.findByIdAndUpdate(syncId, {
      $set: {
        status: 'success',
        results: results.map((r: any, i: number) => ({
          ...r,
          expiredDeleted: i === 0 ? expiredDeleted : 0,
        })),
        finishedAt: new Date(),
      },
    })
  } catch (e: any) {
    await SyncLogModel.findByIdAndUpdate(syncId, {
      $set: {
        status: 'failed',
        results: [{ error: e?.message || String(e) }],
        finishedAt: new Date(),
      },
    })
  }
}
