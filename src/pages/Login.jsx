import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/new logo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Hardcoded credentials for simple admin access
      const expectedEmail = 'drabdessadoksete@gmail.com'
      const expectedPassword = 'drabde.optimumtech'

      if (email === expectedEmail && password === expectedPassword) {
        localStorage.setItem('admin_token', 'hardcoded-admin-token')
        navigate('/admin')
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } catch (err) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <motion.div
        className="card p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-12 mx-auto mb-4 rounded-full object-cover" />
          <h1 className="text-2xl font-bold">Connexion admin</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            className="w-full rounded-xl bg-surface border border-slate-700 px-4 py-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            className="w-full rounded-xl bg-surface border border-slate-700 px-4 py-3"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
