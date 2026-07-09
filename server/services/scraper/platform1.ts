import { getBrowser, newPage } from './browser'
import { buildRawText, type NormalizedProduct } from './types'

const TAB_MAP: Record<string, string> = {
  jingxuan: '精选',
  yidong: '移动',
  liantong: '联通',
  dianxing: '电信',
  guangdian: '广电',
  teshuping: '特殊品',
  kuandai: '宽带',
}

export async function fetchPlatform1(): Promise<NormalizedProduct[]> {
  const config = useRuntimeConfig()
  const { baseUrl, shopId, name: platformName } = config.platform1
  const browser = await getBrowser()
  const page = await newPage(browser)
  const results: NormalizedProduct[] = []
  try {
    await page.goto(`${baseUrl}/ProductEn/Index/${shopId}`, {
      waitUntil: 'networkidle',
      timeout: 45000,
    })
    await page.waitForSelector('#jingxuan li', { timeout: 20000 }).catch(() => {})

    const raw = await page.evaluate(
      ({ tabMap, baseUrl }) => {
        const out: any[] = []
        const tabs = document.querySelectorAll('.new_lst')
        tabs.forEach((tab) => {
          const tabId = tab.id
          const category = (tabMap as Record<string, string>)[tabId] || '精选'
          const lis = tab.querySelectorAll('li')
          lis.forEach((li) => {
            const titleEl = li.querySelector('.spantitle')
            const name = titleEl ? titleEl.textContent?.trim() || '' : ''
            if (!name) return
            const taocan = li.querySelector('.b3')?.textContent?.trim() || ''
            const imgEl = li.querySelector('.f1 dt img') as HTMLImageElement | null
            const img = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || ''
            const buyEl = li.querySelector('.b4 a') as HTMLAnchorElement | null
            let buy = buyEl?.getAttribute('href') || ''
            const share = (li as any)._shareUrl || ''
            const salesText = li.querySelector('.b1')?.textContent || ''
            const salesMatch = salesText.match(/(\d+)\s*领取/)
            const sales = salesMatch ? parseInt(salesMatch[1], 10) : 0
            const ageText = li.querySelector('.b5')?.textContent || ''
            const ageMatch = ageText.match(/(\d+)\s*[-~到至]\s*(\d+)/)
            const f3 = Array.from(li.querySelectorAll('.f3_li')).map((e) => e.textContent?.trim() || '')
            const abs = (u: string) => (u && !/^https?:\/\//.test(u) ? baseUrl + (u.startsWith('/') ? '' : '/') + u : u)
            out.push({
              name,
              category,
              taocan,
              image: abs(img),
              buy: abs(buy),
              share: abs(share),
              sales,
              ageText: ageMatch ? `${ageMatch[1]}-${ageMatch[2]}` : '',
              f3,
            })
          })
        })
        return out
      },
      { tabMap: TAB_MAP, baseUrl },
    )

    const seen = new Set<string>()
    for (const r of raw) {
      const idKey = r.buy || r.share || r.name
      if (seen.has(idKey)) continue
      seen.add(idKey)
      const f3Text = r.f3.join(' ')
      const description = [r.taocan, `年龄${r.ageText || '未知'}`, f3Text].join(' ')
      results.push({
        source: 'platform1',
        sourceProductId: idKey,
        name: r.name,
        operator: '',
        category: r.category,
        taocan: r.taocan,
        description,
        rawText: buildRawText(r.name, r.taocan, description),
        imageUrl: r.image,
        buyUrl: r.buy,
        shareUrl: r.share,
        sales: r.sales,
      })
    }
  } finally {
    await page.close()
  }
  return results
}
