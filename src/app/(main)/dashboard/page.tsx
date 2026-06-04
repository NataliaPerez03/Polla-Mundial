'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Trophy, Target, CheckCircle, Clock, TrendingUp, TrendingDown, Minus, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

function StatCard({
  icon: Icon, label, value, sub, color = 'var(--accent-red)', delay = 0
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string; delay?: number
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-6 translate-x-6"
        style={{ background: color }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="font-bebas text-4xl leading-none mb-1" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<{
    rank: number; totalPoints: number; exactPredictions: number;
    correctPredictions: number; totalPredictions: number; pending: number;
    recentResults: { match: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }; homeScore: number; awayScore: number; points: number; isExact: boolean }[];
    upcoming: { id: string; homeTeam: string; awayTeam: string; homeFlag: string; awayFlag: string; scheduledAt: string; group: string | null; phase: string }[];
  } | null>(null)

  useEffect(() => {
    fetch('/api/standings')
      .then(r => r.json())
      .then((standings: { id: string; totalPoints: number; exactPredictions: number; correctPredictions: number }[]) => {
        const idx = standings.findIndex((s) => s.id === session?.user?.id)
        const me = standings[idx]
        if (!me) return
        fetch('/api/predictions')
          .then(r => r.json())
          .then((preds: { match: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number; scheduledAt: string }; homeScore: number; awayScore: number; points: number; isExact: boolean }[]) => {
            const finished = preds.filter(p => p.match.homeScore !== null)
            const recent = finished.slice(-5).reverse()
            fetch('/api/matches?status=SCHEDULED')
              .then(r => r.json())
              .then((matches: { id: string; homeTeam: string; awayTeam: string; homeFlag: string; awayFlag: string; scheduledAt: string; group: string | null; phase: string }[]) => {
                const predictedIds = new Set(preds.map((p: { match: { homeTeam: string } & Record<string, unknown> } & Record<string, unknown>) => (p as unknown as { matchId: string }).matchId))
                const upcoming = matches.filter(m => !predictedIds.has(m.id)).slice(0, 4)
                setData({
                  rank: idx + 1,
                  totalPoints: me.totalPoints,
                  exactPredictions: me.exactPredictions,
                  correctPredictions: me.correctPredictions,
                  totalPredictions: preds.length,
                  pending: upcoming.length,
                  recentResults: recent,
                  upcoming,
                })
              })
          })
      })
  }, [session])

  const accuracy = data && data.totalPredictions > 0
    ? Math.round((data.correctPredictions / data.totalPredictions) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--accent-red)' }}>
          Bienvenido de vuelta
        </p>
        <h2 className="font-bebas text-4xl md:text-5xl gradient-text-white">
          {session?.user?.name?.split(' ')[0].toUpperCase()}
        </h2>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard icon={Trophy} label="Mis puntos" value={data?.totalPoints ?? '—'}
          sub="total acumulado" color="var(--accent-red)" />
        <StatCard icon={TrendingUp} label="Mi posición" value={data?.rank ? `#${data.rank}` : '—'}
          sub="en el ranking" color="var(--accent-gold)" delay={0.05} />
        <StatCard icon={CheckCircle} label="% de aciertos" value={data ? `${accuracy}%` : '—'}
          sub={`${data?.correctPredictions ?? 0} correctos`} color="#4caf50" delay={0.1} />
        <StatCard icon={Target} label="Exactos" value={data?.exactPredictions ?? '—'}
          sub="resultado perfecto" color="#2196f3" delay={0.15} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming to predict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h3 className="font-oswald text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Pendientes de pronosticar
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Partidos sin tu pronóstico</p>
            </div>
            <Link href="/mis-pronosticos"
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-red)' }}>
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="px-5 pb-5 space-y-2">
            {!data?.upcoming?.length ? (
              <div className="py-8 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>¡Todos los partidos próximos pronosticados!</p>
              </div>
            ) : data.upcoming.map(m => (
              <Link key={m.id} href="/mis-pronosticos">
                <div className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-2xl leading-none">{m.homeFlag}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {m.homeTeam} vs {m.awayTeam}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {format(new Date(m.scheduledAt), "d MMM · HH:mm", { locale: es })}
                      {m.group && ` · Grupo ${m.group}`}
                    </div>
                  </div>
                  <div className="text-2xl leading-none">{m.awayFlag}</div>
                  <div className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent-red)' }}>
                    Pronóstica
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h3 className="font-oswald text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Últimos resultados
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tus pronósticos recientes</p>
            </div>
            <Link href="/fixture"
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-red)' }}>
              Fixture <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="px-5 pb-5 space-y-2">
            {!data?.recentResults?.length ? (
              <div className="py-8 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aún no hay resultados disponibles</p>
              </div>
            ) : data.recentResults.map((r, i) => {
              const diff = (r.homeScore > r.awayScore ? 'L' : r.homeScore < r.awayScore ? 'V' : 'E')
              const realDiff = (r.match.homeScore > r.match.awayScore ? 'L' : r.match.homeScore < r.match.awayScore ? 'V' : 'E')
              const correct = diff === realDiff
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex-1">
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {r.match.homeTeam} vs {r.match.awayTeam}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Real: {r.match.homeScore}-{r.match.awayScore} · Mi pronóstico: {r.homeScore}-{r.awayScore}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.isExact
                      ? <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(76,175,80,0.15)', color: '#4caf50' }}>+{r.points} ⭐</span>
                      : correct
                        ? <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(33,150,243,0.15)', color: '#2196f3' }}>+{r.points}</span>
                        : <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>0</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { href: '/mis-pronosticos', label: 'PRONÓSTICOS', icon: Star, color: 'var(--accent-red)' },
          { href: '/fixture', label: 'FIXTURE', icon: Clock, color: '#2196f3' },
          { href: '/tabla-posiciones', label: 'RANKING', icon: TrendingUp, color: 'var(--accent-gold)' },
          { href: '/estadisticas', label: 'ESTADÍSTICAS', icon: TrendingDown, color: '#9c27b0' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <div className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.03]"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
              <span className="font-oswald font-bold text-sm tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </span>
              <Minus className="w-3 h-3 ml-auto opacity-0" />
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
