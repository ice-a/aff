import { connectDB } from '../utils/mongo'
import { SyncLogModel } from '../models/sync-log'
import { scrapeAll, scrapePlatform } from '../services/scraper'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const platform = body?.platform as 'platform1' | 'platform2' | 'all' | undefined
  const type = (body?.type as 'manual' | 'scheduled') || 'manual'

  await connectDB()

  // 创建同步日志
  const log = await SyncLogModel.create({
    type,
    platform: platform || 'all',
    status: 'running',
    startedAt: new Date(),
  })

  // 后台异步执行同步，不等待结果
  const syncId = log._id.toString()
  runSync(syncId, platform || 'all', type).catch(() => {})

  return { ok: true, syncId, message: '同步已开始' }
})

async function runSync(syncId: string, platform: string, type: string) {
  try {
    let results
    if (platform === 'all') {
      results = await scrapeAll()
    } else {
      const result = await scrapePlatform(platform as 'platform1' | 'platform2')
      results = [result]
    }

    // 计算过期清理数量
    const { deleteExpired } = await import('../services/cleanup')
    let expiredDeleted = 0
    try {
      expiredDeleted = await deleteExpired()
    } catch {}

    // 更新同步日志
    await SyncLogModel.findByIdAndUpdate(syncId, {
      $set: {
        status: 'success',
        results: results.map((r: any) => ({
          ...r,
          expiredDeleted: r === results[0] ? expiredDeleted : 0,
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
