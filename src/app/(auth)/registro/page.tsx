'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Trophy, Eye, EyeOff, Loader2, AlertCircle, Check, X } from 'lucide-react'

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {ok
        ? <Check className="w-3 h-3" style={{ color: '#4caf50' }} />
        : <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />}
      <span style={{ color: ok ? '#4caf50' : 'var(--text-muted)' }}>{text}</span>
    </div>
  )
}

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const rules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    match: form.password === form.confirm && form.confirm.length > 0,
  }
  const valid = Object.values(rules).every(Boolean) && form.name.trim().length >= 2 && form.email.includes('@')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!valid) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al crear cuenta')
        setLoading(false)
        return
      }
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/dashboard')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(230,57,70,0.1),transparent)' }} />
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'var(--accent-gold)', filter: 'blur(60px)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.7, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}
            >
              <Trophy className="w-8 h-8" style={{ color: 'var(--accent-red)' }} />
            </motion.div>
            <h1 className="font-bebas text-4xl gradient-text-white tracking-wider">POLLA MUNDIAL</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Copa FIFA World Cup 2026</p>
          </div>

          <h2 className="font-oswald text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Crear cuenta</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Únete al torneo de pronósticos</p>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', color: '#ff6b6b' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Nombre completo</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                required placeholder="Carlos García"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all input-red"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                required placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all input-red"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all input-red"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1 pl-1">
                  <PasswordRule ok={rules.length} text="Mínimo 8 caracteres" />
                  <PasswordRule ok={rules.upper} text="Al menos una mayúscula" />
                  <PasswordRule ok={rules.number} text="Al menos un número" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirmar contraseña</label>
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all input-red"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: form.confirm.length > 0
                    ? rules.match ? '1px solid rgba(76,175,80,0.5)' : '1px solid rgba(230,57,70,0.5)'
                    : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              {form.confirm.length > 0 && (
                <div className="mt-1 pl-1">
                  <PasswordRule ok={rules.match} text="Las contraseñas coinciden" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !valid}
              className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: 'var(--accent-red)', boxShadow: valid && !loading ? '0 0 25px rgba(230,57,70,0.35)' : 'none' }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...</span>
                : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--accent-red)' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
