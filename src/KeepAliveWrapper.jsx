import { useEffect } from 'react'

export default function KeepAliveWrapper() {
  useEffect(() => {
    let active = true
    let interval

    import('./services/keepalive').then(({ pingSupabase }) => {
      if (!active) return
      pingSupabase()
      interval = setInterval(pingSupabase, 1000 * 60 * 60 * 2)
    })

    return () => {
      active = false
      if (interval) clearInterval(interval)
    }
  }, [])

  return null
}
