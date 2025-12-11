import { useEffect } from 'react'
import { pingSupabase } from './services/keepalive'

export default function KeepAliveWrapper() {
  useEffect(() => {
    pingSupabase()
    const interval = setInterval(pingSupabase, 1000 * 60 * 60 * 2)
    return () => clearInterval(interval)
  }, [])

  return null
}