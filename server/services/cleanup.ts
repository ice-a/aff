import { connectDB } from '../utils/mongo'
import { ProductModel } from '../models/product'

const MS_PER_MONTH = 30 * 24 * 3600 * 1000

export async function deleteExpired(): Promise<number> {
  await connectDB()
  const now = Date.now()
  const docs = await ProductModel.find({
    available: true,
    'extracted.validityMonths': { $ne: null, $lt: 999 },
  }).lean()
  let deleted = 0
  for (const d of docs as any[]) {
    const vm = d.extracted?.validityMonths
    if (vm == null) continue
    const created = new Date(d.createdAt).getTime()
    const expiry = created + vm * MS_PER_MONTH
    if (expiry < now) {
      await ProductModel.deleteOne({ _id: d._id })
      deleted++
    }
  }
  return deleted
}
