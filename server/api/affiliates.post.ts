import { connectDB } from '../utils/mongo'
import { AffiliateCategoryModel, AffiliateLinkModel } from '../models/affiliate'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)

  // ── 分类操作 ──

  if (body.action === 'createCategory') {
    const cat = await AffiliateCategoryModel.create({
      name: body.name,
      icon: body.icon || '',
      sort: body.sort || 0,
    })
    return { ok: true, category: cat }
  }

  if (body.action === 'updateCategory') {
    const cat = await AffiliateCategoryModel.findByIdAndUpdate(
      body.categoryId,
      { $set: { name: body.name, icon: body.icon, sort: body.sort, active: body.active } },
      { new: true },
    )
    if (!cat) throw createError({ statusCode: 404, message: '分类不存在' })
    return { ok: true, category: cat }
  }

  if (body.action === 'deleteCategory') {
    await AffiliateCategoryModel.findByIdAndDelete(body.categoryId)
    // 同时删除该分类下所有链接
    await AffiliateLinkModel.deleteMany({ categoryId: body.categoryId })
    return { ok: true }
  }

  // ── 链接操作 ──

  if (body.action === 'addLink') {
    const cat = await AffiliateCategoryModel.findById(body.categoryId)
    if (!cat) throw createError({ statusCode: 404, message: '分类不存在' })
    const link = await AffiliateLinkModel.create({
      categoryId: body.categoryId,
      name: body.name,
      url: body.url,
      description: body.description || '',
      icon: body.icon || '',
      sort: body.sort || 0,
    })
    return { ok: true, link }
  }

  if (body.action === 'updateLink') {
    const link = await AffiliateLinkModel.findByIdAndUpdate(
      body.linkId,
      { $set: body.data },
      { new: true },
    )
    if (!link) throw createError({ statusCode: 404, message: '链接不存在' })
    return { ok: true, link }
  }

  if (body.action === 'deleteLink') {
    await AffiliateLinkModel.findByIdAndDelete(body.linkId)
    return { ok: true }
  }

  throw createError({ statusCode: 400, message: '未知操作' })
})
