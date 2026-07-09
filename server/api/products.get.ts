import { connectDB } from '../utils/mongo'
import { ProductModel } from '../models/product'

export default defineEventHandler(async (event) => {
  await connectDB()
  const q = getQuery(event)
  const filter: any = {}
  if (q.includeUnavailable !== '1') filter.available = true
  if (q.operator) filter.operator = q.operator
  if (q.category) filter.category = q.category
  if (q.q) filter.$text = { $search: String(q.q) }

  if (q.trafficMin || q.trafficMax) {
    filter['extracted.trafficGeneralG'] = {}
    if (q.trafficMin) filter['extracted.trafficGeneralG'].$gte = Number(q.trafficMin)
    if (q.trafficMax) filter['extracted.trafficGeneralG'].$lte = Number(q.trafficMax)
  }
  if (q.validityMin || q.validityMax) {
    filter['extracted.validityMonths'] = {}
    if (q.validityMin) filter['extracted.validityMonths'].$gte = Number(q.validityMin)
    if (q.validityMax) filter['extracted.validityMonths'].$lte = Number(q.validityMax)
  }
  if (q.callMin || q.callMax) {
    filter['extracted.callMinutes'] = {}
    if (q.callMin) filter['extracted.callMinutes'].$gte = Number(q.callMin)
    if (q.callMax) filter['extracted.callMinutes'].$lte = Number(q.callMax)
  }

  const page = Math.max(1, parseInt(String(q.page || '1'), 10))
  const pageSize = Math.min(60, Math.max(1, parseInt(String(q.pageSize || '24'), 10)))
  const sort: any = {}
  if (q.sort === 'validity') sort['extracted.validityMonths'] = -1
  else if (q.sort === 'sales') sort.sales = -1
  else if (q.sort === 'traffic') sort['extracted.trafficGeneralG'] = -1
  else if (q.sort === 'price') sort['extracted.monthlyRent'] = 1
  else sort.createdAt = -1

  const [items, total] = await Promise.all([
    ProductModel.find(filter).sort(sort).skip((page - 1) * pageSize).limit(pageSize).lean(),
    ProductModel.countDocuments(filter),
  ])
  return { ok: true, total, page, pageSize, items }
})
