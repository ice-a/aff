import * as cheerio from 'cheerio'
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
  const { baseUrl, shopId } = config.platform1
  const results: NormalizedProduct[] = []

  const html = await $fetch(`${baseUrl}/ProductEn/Index/${shopId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })

  const $ = cheerio.load(html)
  const seen = new Set<string>()

  $('.new_lst').each((_, tab) => {
    const tabId = $(tab).attr('id') || ''
    const category = TAB_MAP[tabId] || '精选'

    $(tab).find('li').each((_, li) => {
      const $li = $(li)
      const name = $li.find('.spantitle').text().trim()
      if (!name) return

      const taocan = $li.find('.b3').text().trim()
      const imgEl = $li.find('.f1 dt img')
      const img = imgEl.attr('src') || imgEl.attr('data-src') || ''
      const buyEl = $li.find('.b4 a')
      const buy = buyEl.attr('href') || ''
      const share = ''
      const salesText = $li.find('.b1').text()
      const salesMatch = salesText.match(/(\d+)\s*领取/)
      const sales = salesMatch ? parseInt(salesMatch[1], 10) : 0
      const ageText = $li.find('.b5').text()
      const ageMatch = ageText.match(/(\d+)\s*[-~到至]\s*(\d+)/)
      const f3 = $li.find('.f3_li').map((_, e) => $(e).text().trim()).get()

      const abs = (u: string) => (u && !/^https?:\/\//.test(u) ? baseUrl + (u.startsWith('/') ? '' : '/') + u : u)
      const idKey = buy || name
      if (seen.has(idKey)) return
      seen.add(idKey)

      const f3Text = f3.join(' ')
      const description = [taocan, `年龄${ageMatch ? `${ageMatch[1]}-${ageMatch[2]}` : '未知'}`, f3Text].join(' ')

      results.push({
        source: 'platform1',
        sourceProductId: idKey,
        name,
        operator: '',
        category,
        taocan,
        description,
        rawText: buildRawText(name, taocan, description),
        imageUrl: abs(img),
        buyUrl: abs(buy),
        shareUrl: abs(share),
        sales,
      })
    })
  })

  return results
}