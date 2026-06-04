'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { TrendingUp, Target, Zap, BarChart3 } from 'lucide-react'

type StatsData = {
  evolution: { label: string; points: number; cumPoints: number }[]
  comparison: { name: string; points: number }[]
  accuracy: number
  exactRate: number
  bestStreak: number
  totalPredictions: number
}

const tooltipStyle = {
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  color: 'var(--text-primary)',
  fontSize: '12px',
}

export default function EstadisticasPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
  }, [session])

  if (loading) return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-2xl skeleton" />)}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Summary cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Pronósticos', value: stats?.totalPredictions ?? 0, color: 'var(--accent-red)' },
          { icon: Target, label: '% Aciertos', value: `${stats?.accuracy ?? 0}%`, color: '#64b5f6' },
          { icon: Zap, label: '% Exactos', value: `${stats?.exactRate ?? 0}%`, color: 'var(--accent-gold)' },
          { icon: BarChart3, label: 'Mejor racha', value: `${stats?.bestStreak ?? 0}`, color: '#4caf50' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="font-bebas text-3xl leading-none mb-1" style={{ color: 'var(--text-primary)' }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Evolution chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <h3 className="font-oswald text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Evolución de puntos
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Acumulado partido a partido</p>
        {stats?.evolution?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="cumPoints" stroke="var(--accent-red)" strokeWidth={2.5}
                dot={{ r: 3, fill: 'var(--accent-red)' }} activeDot={{ r: 5 }} name="Puntos acum." />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p style={{ color: 'var(--text-muted)' }}>Sin datos aún</p>
          </div>
        )}
      </motion.div>

      {/* Comparison bar chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <h3 className="font-oswald text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Comparativa de participantes
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Puntos totales por jugador</p>
        {stats?.comparison?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.comparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="points" fill="var(--accent-red)" radius={[0, 6, 6, 0]} name="Puntos" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p style={{ color: 'var(--text-muted)' }}>Sin datos aún</p>
          </div>
        )}
      </motion.div>

      {/* Accuracy breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-oswald font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Distribución de aciertos</h3>
          <div className="space-y-3">
            {[
              { label: 'Exactos', value: stats?.exactRate ?? 0, color: '#4caf50' },
              { label: 'Correctos (no exacto)', value: (stats?.accuracy ?? 0) - (stats?.exactRate ?? 0), color: '#64b5f6' },
              { label: 'Incorrectos', value: 100 - (stats?.accuracy ?? 0), color: 'rgba(255,255,255,0.1)' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{Math.max(0, value).toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(0, value)}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-oswald font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Resumen personal</h3>
          <div className="space-y-3">
            {[
              { label: 'Pronósticos realizados', value: stats?.totalPredictions ?? 0 },
              { label: 'Resultados exactos', value: Math.round(((stats?.exactRate ?? 0) / 100) * (stats?.totalPredictions ?? 0)) },
              { label: 'Resultados correctos', value: Math.round(((stats?.accuracy ?? 0) / 100) * (stats?.totalPredictions ?? 0)) },
              { label: 'Mejor racha', value: `${stats?.bestStreak ?? 0} seguidos` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
