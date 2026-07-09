import mongoose from 'mongoose'
import type { Operator, SourceKey } from '../../types'

const ExtractedInfoSchema = new mongoose.Schema(
  {
    operator: { type: String, default: '其他' },
    planName: { type: String, default: '' },
    validityMonths: { type: Number, default: null },
    validityText: { type: String, default: '' },
    trafficGeneralG: { type: Number, default: null },
    trafficDirectedG: { type: Number, default: null },
    callMinutes: { type: Number, default: null },
    monthlyRent: { type: Number, default: null },
    ageMin: { type: Number, default: null },
    ageMax: { type: Number, default: null },
    area: { type: String, default: '' },
    selectNumber: { type: Boolean, default: false },
    needPhoto: { type: Boolean, default: false },
    price: { type: Number, default: null },
    originalPrice: { type: Number, default: null },
    commission: { type: Number, default: null },
    keywords: { type: [String], default: [] },
  },
  { _id: false },
)

const ProductSchema = new mongoose.Schema(
  {
    source: { type: String, enum: ['platform1', 'platform2'], required: true },
    sourceProductId: { type: String, required: true },
    platformName: { type: String, required: true },
    name: { type: String, required: true },
    operator: { type: String, default: '其他' },
    category: { type: String, default: '精选' },
    taocan: { type: String, default: '' },
    description: { type: String, default: '' },
    rawText: { type: String, default: '' },
    extracted: { type: ExtractedInfoSchema, default: () => ({}) },
    imageUrl: { type: String, default: '' },
    buyUrl: { type: String, default: '' },
    shareUrl: { type: String, default: '' },
    sales: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    lastFetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

ProductSchema.index({ source: 1, sourceProductId: 1 }, { unique: true })
ProductSchema.index({ operator: 1 })
ProductSchema.index({ 'extracted.validityMonths': 1 })
ProductSchema.index({ name: 'text', taocan: 'text', description: 'text' })

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<any>) ||
  mongoose.model('Product', ProductSchema)

export type ProductDoc = mongoose.Document & {
  source: SourceKey
  sourceProductId: string
  platformName: string
  name: string
  operator: Operator
  category: string
  taocan: string
  description: string
  rawText: string
  extracted: any
  imageUrl: string
  buyUrl: string
  shareUrl: string
  sales: number
  available: boolean
  lastFetchedAt: Date
  createdAt: Date
  updatedAt: Date
}
