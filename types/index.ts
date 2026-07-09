export type Operator = '移动' | '联通' | '电信' | '广电' | '其他'

export type SourceKey = 'platform1' | 'platform2'

export interface ExtractedInfo {
  operator: Operator
  planName: string
  validityMonths: number | null
  validityText: string
  trafficGeneralG: number | null
  trafficDirectedG: number | null
  callMinutes: number | null
  monthlyRent: number | null
  ageMin: number | null
  ageMax: number | null
  area: string
  selectNumber: boolean
  needPhoto: boolean
  price: number | null
  originalPrice: number | null
  commission: number | null
  keywords: string[]
}

export interface Product {
  _id?: string
  source: SourceKey
  sourceProductId: string
  platformName: string
  name: string
  operator: Operator
  category: string
  taocan: string
  description: string
  rawText: string
  extracted: ExtractedInfo
  imageUrl: string
  buyUrl: string
  shareUrl: string
  sales: number
  available: boolean
  lastFetchedAt: string
  createdAt: string
  updatedAt: string
}

export interface ProductComparison {
  key: string
  operator: Operator
  planName: string
  platform1: Product | null
  platform2: Product | null
  validityP1: number | null
  validityP2: number | null
  validityDelta: number | null
  betterValidity: 'platform1' | 'platform2' | 'tie' | 'unknown'
}

export interface ScrapeResult {
  source: SourceKey
  platformName: string
  fetched: number
  inserted: number
  updated: number
  failed: number
  durationMs: number
  expiredDeleted?: number
  error?: string
}
