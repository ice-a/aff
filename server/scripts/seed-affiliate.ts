import mongoose from 'mongoose'
import { connectDB } from '../utils/mongo'
import { AffiliateCategoryModel, AffiliateLinkModel } from '../models/affiliate'

const sampleCategories = [
  { name: '网购返利', icon: '🛒', sort: 1 },
  { name: '信用卡推荐', icon: '💳', sort: 2 },
  { name: '话费充值', icon: '📱', sort: 3 },
  { name: '外卖红包', icon: '🍔', sort: 4 },
]

const sampleLinks: Record<string, any[]> = {
  '网购返利': [
    { name: '淘宝联盟', url: 'https://pub.alimama.com', description: '淘宝官方推广平台，海量商品佣金返利', icon: '🔴', sort: 1 },
    { name: '京东联盟', url: 'https://union.jd.com', description: '京东商品推广，高佣金比例', icon: '🔴', sort: 2 },
    { name: '拼多多多多进宝', url: 'https://jinbao.pinduoduo.com', description: '拼多多推广返佣平台', icon: '🟠', sort: 3 },
  ],
  '信用卡推荐': [
    { name: '招商银行信用卡', url: 'https://cc.cmbchina.com', description: '招行热门信用卡申请', icon: '🔴', sort: 1 },
    { name: '中信银行信用卡', url: 'https://creditcard.ecitic.com', description: '中信信用卡在线申请', icon: '🔴', sort: 2 },
  ],
  '话费充值': [
    { name: '支付宝充值', url: 'https://life.alipay.com', description: '支付宝话费充值中心', icon: '🔵', sort: 1 },
    { name: '微信充值', url: 'https://pay.weixin.qq.com', description: '微信话费充值入口', icon: '🟢', sort: 2 },
  ],
  '外卖红包': [
    { name: '美团外卖', url: 'https://waimai.meituan.com', description: '美团外卖天天领红包', icon: '🟡', sort: 1 },
    { name: '饿了么', url: 'https://www.ele.me', description: '饿了么红包天天领', icon: '🔵', sort: 2 },
  ],
}

async function seed() {
  await connectDB()

  const catCount = await AffiliateCategoryModel.countDocuments()
  if (catCount > 0) {
    console.log(`已存在 ${catCount} 个分类，跳过 seed`)
    await mongoose.disconnect()
    return
  }

  const cats = await AffiliateCategoryModel.insertMany(sampleCategories)

  const links: any[] = []
  for (const cat of cats) {
    const catLinks = sampleLinks[cat.name] || []
    for (const link of catLinks) {
      links.push({ ...link, categoryId: cat._id })
    }
  }
  await AffiliateLinkModel.insertMany(links)

  console.log(`✅ 插入 ${cats.length} 个分类，${links.length} 条链接`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
