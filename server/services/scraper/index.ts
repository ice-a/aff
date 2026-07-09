import { connectDB } from '../../utils/mongo'
import { ProductModel } from '../../models/product'
import { extractProductInfo } from '../ai'
import { fetchPlatform1 } from './platform1'
import { fetchPlatform2 } from './platform2'
import { deleteExpired } from '../cleanup'
import type { NormalizedProduct } from './types'
import type { ScrapeResult, SourceKey } from '../../../types'

async function upsertProducts(items: NormalizedProduct[], platformName: string): Promise<{ inserted: number; updated: number }> {
  let inserted = 0
  let updated = 0
  const BATCH = 6
  for (let i = 0; i < items.length; i += BATCH) {
    const slice = items.slice(i, i + BATCH)
    await Promise.all(
      slice.map(async (item) => {
        const extracted = await extractProductInfo(item.rawText, { planName: item.name })
        const operator = extracted.operator !== '其他' ? extracted.operator : item.operator || '其他'
        const doc = await ProductModel.findOneAndUpdate(
          { source: item.source, sourceProductId: item.sourceProductId },
          {
            $set: {
              platformName,
              name: item.name,
              operator,
              category: item.category,
              taocan: item.taocan,
              description: item.description,
              rawText: item.rawText,
              extracted,
              imageUrl: item.imageUrl,
              buyUrl: item.buyUrl,
              shareUrl: item.shareUrl,
              sales: item.sales,
              available: true,
              lastFetchedAt: new Date(),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        )
        if (doc.createdAt && doc.createdAt.getTime() === doc.updatedAt.getTime()) inserted++
        else updated++
      }),
    )
  }
  return { inserted, updated }
}

export async function scrapePlatform(source: SourceKey): Promise<ScrapeResult> {
  const config = useRuntimeConfig()
  const start = Date.now()
  const platformName = source === 'platform1' ? config.platform1.name : config.platform2.name
  try {
    await connectDB()
    const items = source === 'platform1' ? await fetchPlatform1() : await fetchPlatform2()
    const { inserted, updated } = await upsertProducts(items, platformName)
    return {
      source,
      platformName,
      fetched: items.length,
      inserted,
      updated,
      failed: 0,
      durationMs: Date.now() - start,
    }
  } catch (e: any) {
    return {
      source,
      platformName,
      fetched: 0,
      inserted: 0,
      updated: 0,
      failed: 1,
      durationMs: Date.now() - start,
      error: e?.message || String(e),
    }
  }
}

export async function scrapeAll(): Promise<ScrapeResult[]> {
  const [p1, p2] = await Promise.all([scrapePlatform('platform1'), scrapePlatform('platform2')])
  let expiredDeleted = 0
  try {
    expiredDeleted = await deleteExpired()
  } catch {
    expiredDeleted = 0
  }
  return [p1, p2].map((r) => ({ ...r, expiredDeleted }))
}
