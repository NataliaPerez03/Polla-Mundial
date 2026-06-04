'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { DollarSign, CheckCircle, Clock, Users, Settings, Loader2 } from 'lucide-react'

type PozoData = {
  totalPot: number; entryFee: number; paidCount: number; totalCount: number
  prizeFirst: number; prizeSecond: number; prizeThird: number
  users: { id: string; name: string; paid: boolean; totalPoints: number }[]
  config: { entryFee: number; prizeFirst: number; prizeSecond: number; prizeThird: number }
}

function CurrencyDisplay({ amount }: { amount: number }) {
  return <span>${amount.toLocaleString('es-CO')}</span>
}

export default function PozoPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<PozoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [cfg, setCfg] = useState({ entryFee: '', prizeFirst: '', prizeSecond: '', prizeThird: '' })
  const [saving, setSaving] = useState(false)
  const isAdmin = session?.user?.role === 'ADMIN'

  function load() {
    fetch('/api/pozo').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  async function saveConfig() {
    setSaving(true)
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entryFee: parseInt(cfg.entryFee),
        prizeFirst: parseInt(cfg.prizeFirst),
        prizeSecond: parseInt(cfg.prizeSecond),
        prizeThird: parseInt(cfg.prizeThird),
      }),
    })
    setSaving(false)
    setEditing(false)
    load()
  }

  async function togglePaid(userId: string, paid: boolean) {
    await fetch(`/api/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paid }) })
    load()
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-36 rounded-2xl skeleton" />)}
    </div>
  )

  const first = data ? Math.round(data.totalPot * data.prizeFirst / 100) : 0
  const second = data ? Math.round(data.totalPot * data.prizeSecond / 100) : 0
  const third = data ? Math.round(data.totalPot * data.prizeThird / 100) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Total pot */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(255,214,10,0.1),rgba(255,214,10,0.03))', border: '1px solid rgba(255,214,10,0.25)' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 50% 0%,var(--accent-gold),transparent 70%)' }} />
        <DollarSign className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-gold)' }} />
        <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--accent-gold)' }}>
          Total recaudado
        </p>
        <div className="font-bebas text-6xl md:text-8xl" style={{ color: 'var(--accent-gold)' }}>
          {data ? <CurrencyDisplay amount={data.totalPot} /> : '—'}
        </div>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {data?.paidCount ?? 0} de {data?.totalCount ?? 0} participantes han pagado ·{' '}
          <CurrencyDisplay amount={data?.entryFee ?? 0} /> c/u
        </p>

        {isAdmin && (
          <button onClick={() => { setEditing(!editing); if (data) setCfg({ entryFee: String(data.config.entryFee), prizeFirst: String(data.config.prizeFirst), prizeSecond: String(data.config.prizeSecond), prizeThird: String(data.config.prizeThird) }) }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.2)', color: 'var(--accent-gold)' }}>
            <Settings className="w-3 h-3" /> Configurar
          </button>
        )}
      </motion.div>

      {/* Config editor */}
      {editing && isAdmin && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-oswald font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Configuración del pozo</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              { key: 'entryFee', label: 'Inscripción por persona' },
              { key: 'prizeFirst', label: '1er puesto (%)' },
              { key: 'prizeSecond', label: '2do puesto (%)' },
              { key: 'prizeThird', label: '3er puesto (%)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                <input type="number" value={cfg[key as keyof typeof cfg]}
                  onChange={e => setCfg({ ...cfg, [key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none input-red"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={saveConfig} disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2"
              style={{ background: 'var(--accent-red)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Guardar
            </button>
            <button onClick={() => setEditing(false)}
              className="px-5 py-2 rounded-xl text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* Prize distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <h3 className="font-oswald text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Distribución de premios</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { pos: 1, emoji: '🥇', label: '1er lugar', amount: first, pct: data?.prizeFirst ?? 60, color: 'var(--accent-gold)' },
            { pos: 2, emoji: '🥈', label: '2do lugar', amount: second, pct: data?.prizeSecond ?? 25, color: 'var(--accent-silver)' },
            { pos: 3, emoji: '🥉', label: '3er lugar', amount: third, pct: data?.prizeThird ?? 15, color: 'var(--accent-bronze)' },
          ].map(({ pos, emoji, label, amount, pct, color }) => (
            <div key={pos} className="text-center p-4 rounded-2xl"
              style={{ background: `${color}0a`, border: `1px solid ${color}20` }}>
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-oswald font-bold text-sm mb-1" style={{ color }}>{label}</div>
              <div className="font-bebas text-2xl" style={{ color: 'var(--text-primary)' }}>
                <CurrencyDisplay amount={amount} />
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{pct}%</div>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 mb-5">
          <Users className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
          <h3 className="font-oswald text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Estado de pagos</h3>
          <div className="ml-auto text-sm" style={{ color: 'var(--text-muted)' }}>
            {data?.paidCount}/{data?.totalCount} pagados
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data?.users?.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: user.paid ? 'rgba(76,175,80,0.15)' : 'rgba(255,152,0,0.12)', color: user.paid ? '#4caf50' : '#ff9800' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
                <div className="flex items-center gap-1 text-xs">
                  {user.paid
                    ? <><CheckCircle className="w-3 h-3" style={{ color: '#4caf50' }} /> <span style={{ color: '#4caf50' }}>Pagado</span></>
                    : <><Clock className="w-3 h-3" style={{ color: '#ff9800' }} /> <span style={{ color: '#ff9800' }}>Pendiente</span></>}
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => togglePaid(user.id, !user.paid)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110"
                  style={{ background: user.paid ? 'rgba(255,152,0,0.12)' : 'rgba(76,175,80,0.15)' }}>
                  {user.paid ? '↩' : '✓'}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
