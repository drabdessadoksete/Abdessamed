import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAdminUser, onAuthStateChange } from '../services/api'

export default function AdminGuard({ children }) {
  const [state, setState] = useState('checking')
  const location = useLocation()

  useEffect(() => {
    let active = true

    const verify = async () => {
      const user = await getAdminUser()
      if (active) setState(user ? 'allowed' : 'denied')
    }

    verify()
    const subscription = onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setState('denied')
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') setTimeout(verify, 0)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (state === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Vérification de la session…</div>
  }

  if (state === 'denied') {
    return <Navigate to="/login/" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  }

  return children
}
