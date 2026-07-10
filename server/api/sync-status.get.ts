import { connectDB } from '../utils/mongo'
import { SyncLogModel } from '../models/sync-log'

export default defineEventHandler(async (event) => {
  await connectDB()
  const q = getQuery(event)
  const limit = Math.min(20, Math.max(1, parseInt(String(q.limit || '10'), 10)))

  const logs = await SyncLogModel.find()
    .sort({ startedAt: -1 })
    .limit(limit)
    .lean()

  return { ok: true, logs }
})
