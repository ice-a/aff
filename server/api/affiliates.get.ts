import { connectDB } from '../utils/mongo'
import { AffiliateCategoryModel } from '../models/affiliate'
import { AffiliateLinkModel } from '../models/affiliate'

export default defineEventHandler(async () => {
  await connectDB()
  const categories = await AffiliateCategoryModel.find({ active: true })
    .sort({ sort: 1, createdAt: 1 })
    .lean()

  const catIds = categories.map(c => c._id)
  const links = await AffiliateLinkModel.find({ categoryId: { $in: catIds }, active: true })
    .sort({ sort: 1, createdAt: 1 })
    .lean()

  const linkMap = new Map<string, any[]>()
  for (const link of links) {
    const key = String(link.categoryId)
    if (!linkMap.has(key)) linkMap.set(key, [])
    linkMap.get(key)!.push(link)
  }

  return categories.map(cat => ({
    ...cat,
    links: linkMap.get(String(cat._id)) || [],
  }))
})
