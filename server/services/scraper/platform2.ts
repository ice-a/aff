import * as cheerio from 'cheerio'
import { buildRawText, type NormalizedProduct } from './types'

export async function fetchPlatform2(): Promise<NormalizedProduct[]> {
  const config = useRuntimeConfig()
  const { baseUrl } = config.platform2
  const results: NormalizedProduct[] = []

  // 先尝试直接请求 HTML
  const html = await $fetch(baseUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })

  const $ = cheerio.load(html)
  const seen = new Set<string>()

  // 尝试多种选择器
  const selectors = ['#productList > div', '.product-card', '[class*="product"]', '.card']
  
  for (const selector of selectors) {
    $(selector).each((_, card) => {
      const $card = $(card)
      const name = $card.find('.card-title, h3, h4, [class*="title"]').first().text().trim()
      if (!name) return

      const desc = $card.find('.mb-2, .desc, [class*="desc"]').first().text().trim()
      const img = $card.find('img').first().attr('src') || $card.find('img').first().attr('data-src') || ''
      const buyEl = $card.find('a[href*="buy"], a[href*="order"], .btn-buy, a[class*="buy"]')
      const buy = buyEl.attr('href') || ''
      const text = $card.text().replace(/\s+/g, ' ').trim()

      const pidMatch = buy.match(/pid=([^&]+)/)
      const pid = pidMatch ? pidMatch[1] : buy || name
      if (seen.has(pid)) return
      seen.add(pid)

      const description = [desc, text].filter(Boolean).join(' ').slice(0, 2000)
      const abs = (u: string) => (u && !/^https?:\/\//.test(u) ? baseUrl + (u.startsWith('/') ? '' : '/') + u : u)

      results.push({
        source: 'platform2',
        sourceProductId: pid,
        name,
        operator: '',
        category: '精选',
        taocan: desc,
        description,
        rawText: buildRawText(name, desc, text),
        imageUrl: abs(img),
        buyUrl: abs(buy),
        shareUrl: abs(buy),
        sales: 0,
      })
    })
    
    if (results.length > 0) break
  }

  // 如果 HTML 中没有数据，尝试常见的 API 端点
  if (results.length === 0) {
    const apiEndpoints = [
      '/api/products',
      '/api/goods/list',
      '/api/v1/products',
      '/product/list',
    ]

    for (const endpoint of apiEndpoints) {
      try {
        const data = await $fetch(baseUrl + endpoint)
        if (data && typeof data === 'object') {
          const items = data.data || data.items || data.list || data.products || []
          for (const item of items) {
            const name = item.name || item.title || item.productName || ''
            if (!name) continue
            const pid = item.id || item.productId || item.pid || name
            if (seen.has(String(pid))) continue
            seen.add(String(pid))

            results.push({
              source: 'platform2',
              sourceProductId: String(pid),
              name,
              operator: '',
              category: '精选',
              taocan: item.desc || item.description || '',
              description: item.desc || item.description || '',
              rawText: buildRawText(name, item.desc || '', item.description || ''),
              imageUrl: item.image || item.img || item.imageUrl || '',
              buyUrl: item.buyUrl || item.url || '',
              shareUrl: item.shareUrl || item.buyUrl || '',
              sales: item.sales || 0,
            })
          }
          if (results.length > 0) break
        }
      } catch {
        continue
      }
    }
  }

  return results
}