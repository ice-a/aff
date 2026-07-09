import { deleteExpired } from '../services/cleanup'

export default defineNitroPlugin(() => {
  const run = () => {
    deleteExpired().catch(() => {})
  }
  setTimeout(run, 60 * 1000)
  const timer = setInterval(run, 60 * 60 * 1000)
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => clearInterval(timer))
  }
})
