import mongoose from 'mongoose'
import { ProductModel } from '../models/product'

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DB = process.env.MONGODB_DB || 'traffic_card_hub'

const now = new Date()

function mk(p: any) {
  return {
    available: true,
    lastFetchedAt: now,
    createdAt: now,
    updatedAt: now,
    ...p,
  }
}

const samples = [
  // 平台1 畅行号卡
  mk({
    source: 'platform1', sourceProductId: 'p1-yd-29', platformName: '畅行号卡', name: '移动花卡29元版',
    operator: '移动', category: '移动', taocan: '月租29元，通用流量135G+定向30G，通话100分钟，有效期12个月，年龄18-60周岁，支持选号',
    description: '移动花卡29元版 月租29元，通用流量135G+定向30G，通话100分钟，有效期12个月', rawText: '【移动花卡29元版】\n月租29元，通用流量135G+定向30G，通话100分钟，有效期12个月，年龄18-60周岁，支持选号',
    imageUrl: '', buyUrl: 'https://260709.chshebei.cn/ProductEn/Index/00de96ec16cfec53', shareUrl: '', sales: 320,
    extracted: { operator: '移动', planName: '移动花卡29元版', validityMonths: 12, validityText: '12个月', trafficGeneralG: 135, trafficDirectedG: 30, callMinutes: 100, monthlyRent: 29, ageMin: 18, ageMax: 60, area: '全国', selectNumber: true, needPhoto: false, price: 29, originalPrice: null, commission: null, keywords: ['大流量', '低月租'] },
  }),
  mk({
    source: 'platform1', sourceProductId: 'p1-lt-39', platformName: '畅行号卡', name: '联通大王卡39元版',
    operator: '联通', category: '联通', taocan: '月租39元，通用流量160G，定向40G，通话200分钟，有效期24个月，年龄16-65周岁',
    description: '联通大王卡39元版 月租39元，通用流量160G，定向40G，通话200分钟，有效期24个月', rawText: '【联通大王卡39元版】\n月租39元，通用流量160G，定向40G，通话200分钟，有效期24个月，年龄16-65周岁',
    imageUrl: '', buyUrl: 'https://260709.chshebei.cn/ProductEn/Index/00de96ec16cfec53', shareUrl: '', sales: 210,
    extracted: { operator: '联通', planName: '联通大王卡39元版', validityMonths: 24, validityText: '24个月', trafficGeneralG: 160, trafficDirectedG: 40, callMinutes: 200, monthlyRent: 39, ageMin: 16, ageMax: 65, area: '全国', selectNumber: false, needPhoto: false, price: 39, originalPrice: null, commission: null, keywords: ['大流量'] },
  }),
  mk({
    source: 'platform1', sourceProductId: 'p1-dx-19', platformName: '畅行号卡', name: '电信星卡19元版',
    operator: '电信', category: '电信', taocan: '月租19元，通用流量80G，定向30G，通话0分钟，有效期6个月，年龄18-60周岁，需传照片',
    description: '电信星卡19元版 月租19元，通用流量80G，定向30G，通话0分钟，有效期6个月', rawText: '【电信星卡19元版】\n月租19元，通用流量80G，定向30G，通话0分钟，有效期6个月，年龄18-60周岁，需传照片',
    imageUrl: '', buyUrl: 'https://260709.chshebei.cn/ProductEn/Index/00de96ec16cfec53', shareUrl: '', sales: 540,
    extracted: { operator: '电信', planName: '电信星卡19元版', validityMonths: 6, validityText: '6个月', trafficGeneralG: 80, trafficDirectedG: 30, callMinutes: 0, monthlyRent: 19, ageMin: 18, ageMax: 60, area: '全国', selectNumber: false, needPhoto: true, price: 19, originalPrice: null, commission: null, keywords: ['低价', '学生'] },
  }),
  mk({
    source: 'platform1', sourceProductId: 'p1-gd-29', platformName: '畅行号卡', name: '广电双百卡29元版',
    operator: '广电', category: '广电', taocan: '月租29元，通用流量100G，定向0G，通话100分钟，有效期12个月，年龄18-70周岁',
    description: '广电双百卡29元版 月租29元，通用流量100G，通话100分钟，有效期12个月', rawText: '【广电双百卡29元版】\n月租29元，通用流量100G，通话100分钟，有效期12个月，年龄18-70周岁',
    imageUrl: '', buyUrl: 'https://260709.chshebei.cn/ProductEn/Index/00de96ec16cfec53', shareUrl: '', sales: 88,
    extracted: { operator: '广电', planName: '广电双百卡29元版', validityMonths: 12, validityText: '12个月', trafficGeneralG: 100, trafficDirectedG: 0, callMinutes: 100, monthlyRent: 29, ageMin: 18, ageMax: 70, area: '全国', selectNumber: false, needPhoto: false, price: 29, originalPrice: null, commission: null, keywords: ['双百'] },
  }),
  // 平台2 木子号卡（含与平台1同运营商同名的可对比项）
  mk({
    source: 'platform2', sourceProductId: 'p2-yd-29', platformName: '木子号卡', name: '移动花卡29元版',
    operator: '移动', category: '精选', taocan: '月租29元，通用流量130G+定向35G，通话100分钟，有效期24个月，年龄18-60周岁，支持选号',
    description: '移动花卡29元版 月租29元，通用流量130G+定向35G，通话100分钟，有效期24个月', rawText: '【移动花卡29元版】\n月租29元，通用流量130G+定向35G，通话100分钟，有效期24个月，年龄18-60周岁，支持选号',
    imageUrl: '', buyUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=yd29', shareUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=yd29', sales: 0,
    extracted: { operator: '移动', planName: '移动花卡29元版', validityMonths: 24, validityText: '24个月', trafficGeneralG: 130, trafficDirectedG: 35, callMinutes: 100, monthlyRent: 29, ageMin: 18, ageMax: 60, area: '全国', selectNumber: true, needPhoto: false, price: 29, originalPrice: null, commission: null, keywords: ['大流量'] },
  }),
  mk({
    source: 'platform2', sourceProductId: 'p2-lt-39', platformName: '木子号卡', name: '联通大王卡39元版',
    operator: '联通', category: '精选', taocan: '月租39元，通用流量150G，定向50G，通话200分钟，有效期12个月，年龄16-65周岁',
    description: '联通大王卡39元版 月租39元，通用流量150G，定向50G，通话200分钟，有效期12个月', rawText: '【联通大王卡39元版】\n月租39元，通用流量150G，定向50G，通话200分钟，有效期12个月，年龄16-65周岁',
    imageUrl: '', buyUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=lt39', shareUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=lt39', sales: 0,
    extracted: { operator: '联通', planName: '联通大王卡39元版', validityMonths: 12, validityText: '12个月', trafficGeneralG: 150, trafficDirectedG: 50, callMinutes: 200, monthlyRent: 39, ageMin: 16, ageMax: 65, area: '全国', selectNumber: false, needPhoto: false, price: 39, originalPrice: null, commission: null, keywords: ['大流量'] },
  }),
  mk({
    source: 'platform2', sourceProductId: 'p2-dx-19', platformName: '木子号卡', name: '电信星卡19元版',
    operator: '电信', category: '精选', taocan: '月租19元，通用流量85G，定向30G，通话0分钟，有效期12个月，年龄18-60周岁，需传照片',
    description: '电信星卡19元版 月租19元，通用流量85G，定向30G，通话0分钟，有效期12个月', rawText: '【电信星卡19元版】\n月租19元，通用流量85G，定向30G，通话0分钟，有效期12个月，年龄18-60周岁，需传照片',
    imageUrl: '', buyUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=dx19', shareUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=dx19', sales: 0,
    extracted: { operator: '电信', planName: '电信星卡19元版', validityMonths: 12, validityText: '12个月', trafficGeneralG: 85, trafficDirectedG: 30, callMinutes: 0, monthlyRent: 19, ageMin: 18, ageMax: 60, area: '全国', selectNumber: false, needPhoto: true, price: 19, originalPrice: null, commission: null, keywords: ['低价'] },
  }),
  mk({
    source: 'platform2', sourceProductId: 'p2-yd-59', platformName: '木子号卡', name: '移动尊享卡59元版',
    operator: '移动', category: '精选', taocan: '月租59元，通用流量200G，定向60G，通话500分钟，长期有效，年龄18-70周岁，支持选号',
    description: '移动尊享卡59元版 月租59元，通用流量200G，定向60G，通话500分钟，长期有效', rawText: '【移动尊享卡59元版】\n月租59元，通用流量200G，定向60G，通话500分钟，长期有效，年龄18-70周岁，支持选号',
    imageUrl: '', buyUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=yd59', shareUrl: 'https://leemuzi.hemorn.cn/order/index?uid=bzBzYWFuSDkvYXM9&pid=yd59', sales: 0,
    extracted: { operator: '移动', planName: '移动尊享卡59元版', validityMonths: 999, validityText: '长期有效', trafficGeneralG: 200, trafficDirectedG: 60, callMinutes: 500, monthlyRent: 59, ageMin: 18, ageMax: 70, area: '全国', selectNumber: true, needPhoto: false, price: 59, originalPrice: null, commission: null, keywords: ['尊享', '长期'] },
  }),
]

async function main() {
  await mongoose.connect(URI, { dbName: DB })
  await ProductModel.deleteMany({})
  await ProductModel.insertMany(samples)
  console.log(`已写入 ${samples.length} 条示例商品`)
  await mongoose.disconnect()
}

main().catch((e) => {
  console.error('种子写入失败:', e)
  process.exit(1)
})
