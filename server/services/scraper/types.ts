import type { SourceKey } from '../../../types'

export interface NormalizedProduct {
  source: SourceKey
  sourceProductId: string
  name: string
  operator: string
  category: string
  taocan: string
  description: string
  rawText: string
  imageUrl: string
  buyUrl: string
  shareUrl: string
  sales: number
}

export function buildRawText(name: string, taocan: string, description: string): string {
  return [`【${name}】`, taocan, description].filter(Boolean).join('\n')
}
