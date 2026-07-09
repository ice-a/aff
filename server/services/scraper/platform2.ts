import { getBrowser, newPage } from './browser'
import { buildRawText, type NormalizedProduct } from './types'

export async function fetchPlatform2(): Promise<NormalizedProduct[]> {
  const config = useRuntimeConfig()
  const { baseUrl, name: platformName } = config.platform2
  const browser = await getBrowser()
  const page = await newPage(browser)
  const results: NormalizedProduct[] = []
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForSelector('#productList', { timeout: 20000 }).catch(() => {})
    await page.waitForTimeout(3000)

    const raw = await page.evaluate(() => {
      const out: any[] = []
      const cards = Array.from(document.querySelectorAll('#productList > div'))
      cards.forEach((card) => {
        const titleEl = card.querySelector('.card-title')
        const name = titleEl ? titleEl.textContent?.trim() || '' : ''
        if (!name) return
        const descEl = card.querySelector('.mb-2')
        const desc = descEl ? descEl.textContent?.trim() || '' : ''
        const imgEl = card.querySelector('img') as HTMLImageElement | null
        const img = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || ''
        const buyEl = card.querySelector('.btn-buy') as HTMLAnchorElement | null
        const buy = buyEl?.getAttribute('href') || ''
        const text = card.textContent?.replace(/\s+/g, ' ').trim() || ''
        out.push({ name, desc, img, buy, text })
      })
      return out
    })

    const seen = new Set<string>()
    for (const r of raw) {
      const pidMatch = r.buy.match(/pid=([^&]+)/)
      const pid = pidMatch ? pidMatch[1] : r.buy || r.name
      if (seen.has(pid)) continue
      seen.add(pid)
      const description = [r.desc, r.text].filter(Boolean).join(' ').slice(0, 2000)
      results.push({
        source: 'platform2',
        sourceProductId: pid,
        name: r.name,
        operator: '',
        category: '精选',
        taocan: r.desc,
        description,
        rawText: buildRawText(r.name, r.desc, r.text),
        imageUrl: r.img,
        buyUrl: r.buy ? (r.buy.startsWith('http') ? r.buy : baseUrl + (r.buy.startsWith('/') ? '' : '/') + r.buy) : '',
        shareUrl: r.buy ? (r.buy.startsWith('http') ? r.buy : baseUrl + (r.buy.startsWith('/') ? '' : '/') + r.buy) : '',
        sales: 0,
      })
    }
  } finally {
    await page.close()
  }
  return results
}
