import OpenAI from 'openai'
import type { ExtractedInfo, Operator } from '../../types'

const OPERATORS: Operator[] = ['移动', '联通', '电信', '广电']

function emptyExtracted(): ExtractedInfo {
  return {
    operator: '其他',
    planName: '',
    validityMonths: null,
    validityText: '',
    trafficGeneralG: null,
    trafficDirectedG: null,
    callMinutes: null,
    monthlyRent: null,
    ageMin: null,
    ageMax: null,
    area: '',
    selectNumber: false,
    needPhoto: false,
    price: null,
    originalPrice: null,
    commission: null,
    keywords: [],
  }
}

function detectOperator(text: string): Operator {
  for (const op of OPERATORS) {
    if (text.includes(op)) return op
  }
  return '其他'
}

function monthsFromText(text: string): { months: number | null; raw: string } {
  const t = text.replace(/\s/g, '')
  if (/长期|永久|不限/.test(t)) return { months: 999, raw: '长期有效' }
  const yearMatch = t.match(/(\d+)\s*年/)
  if (yearMatch) return { months: parseInt(yearMatch[1], 10) * 12, raw: `${yearMatch[1]}年` }
  if (/两\s*年/.test(t)) return { months: 24, raw: '两年' }
  if (/一\s*年|1\s*年/.test(t) && !yearMatch) return { months: 12, raw: '一年' }
  if (/半\s*年/.test(t)) return { months: 6, raw: '半年' }
  const monthMatch = t.match(/(\d+)\s*个?\s*月/)
  if (monthMatch) return { months: parseInt(monthMatch[1], 10), raw: `${monthMatch[1]}个月` }
  return { months: null, raw: '' }
}

export function ruleExtract(text: string, name = ''): ExtractedInfo {
  const res = emptyExtracted()
  res.operator = detectOperator(name + ' ' + text)
  const t = text.replace(/\s/g, '')
  const vm = monthsFromText(t)
  res.validityMonths = vm.months
  res.validityText = vm.raw

  const gen = t.match(/(\d+(?:\.\d+)?)\s*G?\s*通用/)
  if (gen) res.trafficGeneralG = parseFloat(gen[1])
  const dir = t.match(/(\d+(?:\.\d+)?)\s*G?\s*定向/)
  if (dir) res.trafficDirectedG = parseFloat(dir[1])

  const call = t.match(/(\d+)\s*分钟/)
  if (call) res.callMinutes = parseInt(call[1], 10)

  const rent = t.match(/(?:月租|资费|套餐费|每月)\s*(\d+(?:\.\d+)?)\s*元/)
  if (rent) res.monthlyRent = parseFloat(rent[1])

  const age = t.match(/(\d+)\s*[-~到至]\s*(\d+)\s*周岁/)
  if (age) {
    res.ageMin = parseInt(age[1], 10)
    res.ageMax = parseInt(age[2], 10)
  }

  res.selectNumber = /支持选号|可选号/.test(t)
  res.needPhoto = /需传照片|需要照片|传照片/.test(t)
  res.planName = name
  return res
}

const SYSTEM_PROMPT = `你是流量卡商品信息提取助手。从给定的商品标题与套餐文案中提取结构化字段，严格返回 JSON。
字段说明：
- operator: 运营商，取值 移动/联通/电信/广电/其他
- planName: 套餐名称（简短）
- validityMonths: 有效期（月），数字；长期/永久填 999；未知填 null
- validityText: 有效期原文片段
- trafficGeneralG: 通用流量（GB），数字或 null
- trafficDirectedG: 定向流量（GB），数字或 null
- callMinutes: 通话分钟，数字或 null
- monthlyRent: 月租（元），数字或 null
- ageMin: 最小办理年龄，数字或 null
- ageMax: 最大办理年龄，数字或 null
- area: 可办地区，字符串
- selectNumber: 是否支持选号，布尔
- needPhoto: 是否需要传照片，布尔
- price: 当前售价（元），数字或 null
- originalPrice: 原价（元），数字或 null
- commission: 佣金（元），数字或 null
- keywords: 标签数组

只输出 JSON，不要解释。`

export async function extractProductInfo(
  text: string,
  hint?: Partial<ExtractedInfo>,
): Promise<ExtractedInfo> {
  const config = useRuntimeConfig()
  if (!config.aiApiKey) {
    return { ...ruleExtract(text, hint?.planName || ''), ...hint }
  }
  try {
    const client = new OpenAI({ apiKey: config.aiApiKey, baseURL: config.aiBaseUrl })
    const completion = await client.chat.completions.create({
      model: config.aiModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
    const raw = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(raw) as Partial<ExtractedInfo>
    return { ...emptyExtracted(), ...parsed, ...hint }
  } catch (e) {
    return { ...ruleExtract(text, hint?.planName || ''), ...hint }
  }
}
