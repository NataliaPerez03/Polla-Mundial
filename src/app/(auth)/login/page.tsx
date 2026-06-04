'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(230,57,70,0.1),transparent)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 100%,rgba(230,57,70,0.06),transparent)' }} />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'var(--accent-red)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-5"
        style={{ background: 'var(--accent-gold)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-8 md:p-10" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.7, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}
            >
              <Trophy className="w-8 h-8" style={{ color: 'var(--accent-red)' }} />
            </motion.div>
            <h1 className="font-bebas text-4xl gradient-text-white tracking-wider">POLLA MUNDIAL</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Copa FIFA World Cup 2026</p>
          </div>

          <h2 className="font-oswald text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Inicia sesión</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Accede a tus pronósticos y posición en el ranking</p>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm"
              style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', color: '#ff6b6b' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all input-red"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all input-red"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              style={{ background: 'var(--accent-red)', boxShadow: loading ? 'none' : '0 0 25px rgba(230,57,70,0.35)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--accent-red)' }}>
              Regístrate aquí
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs text-center mb-3 font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Credenciales de demo
            </p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@mundial2026.com', pwd: 'Admin2026!' },
                { role: 'Jugador', email: 'carlos@mundial2026.com', pwd: 'Mundial2026!' },
              ].map(c => (
                <button key={c.role} onClick={() => { setEmail(c.email); setPassword(c.pwd) }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}
                >
                  <span className="font-semibold" style={{ color: 'var(--accent-red)' }}>{c.role}</span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{c.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
