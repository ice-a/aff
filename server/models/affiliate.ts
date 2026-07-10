import mongoose from 'mongoose'

/* ── 分类集合 ── */
const AffiliateCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: '' },
    sort: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

AffiliateCategorySchema.index({ sort: 1 })

export const AffiliateCategoryModel =
  (mongoose.models.AffiliateCategory as mongoose.Model<any>) ||
  mongoose.model('AffiliateCategory', AffiliateCategorySchema)

/* ── 链接集合 ── */
const AffiliateLinkSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'AffiliateCategory', required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    sort: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

AffiliateLinkSchema.index({ categoryId: 1, sort: 1 })

export const AffiliateLinkModel =
  (mongoose.models.AffiliateLink as mongoose.Model<any>) ||
  mongoose.model('AffiliateLink', AffiliateLinkSchema)

/* ── 类型 ── */
export type AffiliateCategoryDoc = mongoose.Document & {
  name: string
  icon: string
  sort: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export type AffiliateLinkDoc = mongoose.Document & {
  categoryId: string
  name: string
  url: string
  description: string
  icon: string
  sort: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}
