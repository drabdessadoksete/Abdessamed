import { useEffect } from 'react'
import { supabase } from '../services/supabase'

export default function KeepAlive() {
  useEffect(() => {
    const keepAlive = async () => {
      try {
        await supabase.from("messages").select("id").limit(1)
      } catch {}
    }

    keepAlive()
    const interval = setInterval(keepAlive, 2 * 60 * 60 * 1000) // 2 hours

    return () => clearInterval(interval)
  }, [])

  return null
}