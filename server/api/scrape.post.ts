import { scrapeAll } from '../services/scraper'

export default defineEventHandler(async () => {
  const results = await scrapeAll()
  return { ok: true, results }
})
