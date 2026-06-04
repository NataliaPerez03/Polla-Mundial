'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MapPin, Clock } from 'lucide-react'

type Match = {
  id: string; matchNumber: number; homeTeam: string; awayTeam: string
  homeFlag: string; awayFlag: string; homeCode: string; awayCode: string
  phase: string; group: string | null; venue: string | null; city: string | null
  scheduledAt: string; homeScore: number | null; awayScore: number | null; status: string
  predictions: { homeScore: number; awayScore: number; points: number; isExact: boolean }[]
}

const phases = [
  { key: 'GROUPS', label: 'Grupos' },
  { key: 'ROUND_OF_32', label: '32avos' },
  { key: 'ROUND_OF_16', label: 'Octavos' },
  { key: 'QUARTERFINALS', label: 'Cuartos' },
  { key: 'SEMIFINALS', label: 'Semis' },
  { key: 'THIRD_PLACE', label: '3er Lugar' },
  { key: 'FINAL', label: 'Final' },
]
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function StatusBadge({ status }: { status: string }) {
  if (status === 'LIVE') return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent-red)' }}>
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red" />
      EN VIVO
    </div>
  )
  if (status === 'FINISHED') return (
    <div className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
      FINALIZADO
    </div>
  )
  return (
    <div className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(33,150,243,0.1)', color: '#64b5f6' }}>
      PRÓXIMO
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  const pred = match.predictions?.[0]
  const isFinished = match.status === 'FINISHED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 transition-all hover:scale-[1.005]"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{match.matchNumber}</span>
          <StatusBadge status={match.status} />
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3 h-3" />
          {format(new Date(match.scheduledAt), "d MMM · HH:mm", { locale: es })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-3xl leading-none">{match.homeFlag}</span>
          <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>
            {match.homeTeam}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{match.homeCode}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          {isFinished ? (
            <div className="font-bebas text-3xl leading-none" style={{ color: 'var(--text-primary)' }}>
              {match.homeScore} – {match.awayScore}
            </div>
          ) : (
            <div className="font-bebas text-2xl leading-none" style={{ color: 'var(--text-muted)' }}>VS</div>
          )}
          {pred && (
            <div className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${pred.isExact ? 'text-green-400' : isFinished ? 'text-blue-400' : ''}`}
              style={{
                background: pred.isExact ? 'rgba(76,175,80,0.12)' : isFinished ? 'rgba(33,150,243,0.1)' : 'rgba(255,255,255,0.05)',
                color: pred.isExact ? '#4caf50' : isFinished ? '#64b5f6' : 'var(--text-muted)',
              }}>
              {pred.homeScore}–{pred.awayScore}
              {isFinished && ` (+${pred.points})`}
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-3xl leading-none">{match.awayFlag}</span>
          <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>
            {match.awayTeam}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{match.awayCode}</span>
        </div>
      </div>

      {match.city && (
        <div className="mt-3 flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <MapPin className="w-3 h-3" />
          {match.city}{match.venue ? ` · ${match.venue}` : ''}
        </div>
      )}
    </motion.div>
  )
}

export default function FixturePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [phase, setPhase] = useState('GROUPS')
  const [group, setGroup] = useState('A')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const q = phase === 'GROUPS' ? `?phase=${phase}&group=${group}` : `?phase=${phase}`
    fetch(`/api/matches${q}`)
      .then(r => r.json())
      .then(d => { setMatches(d); setLoading(false) })
  }, [phase, group])

  const byDate = matches.reduce<Record<string, Match[]>>((acc, m) => {
    const key = format(new Date(m.scheduledAt), 'yyyy-MM-dd')
    acc[key] = [...(acc[key] ?? []), m]
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      {/* Phase tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {phases.map(p => (
          <button key={p.key} onClick={() => { setPhase(p.key); if (p.key === 'GROUPS') setGroup('A') }}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: phase === p.key ? 'var(--accent-red)' : 'var(--bg-elevated)',
              color: phase === p.key ? 'white' : 'var(--text-secondary)',
              boxShadow: phase === p.key ? '0 0 15px rgba(230,57,70,0.3)' : 'none',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Group tabs */}
      {phase === 'GROUPS' && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-thin">
          {groups.map(g => (
            <button key={g} onClick={() => setGroup(g)}
              className="w-9 h-9 flex-shrink-0 rounded-xl text-sm font-bold transition-all"
              style={{
                background: group === g ? 'rgba(230,57,70,0.2)' : 'var(--bg-card)',
                color: group === g ? 'var(--accent-red)' : 'var(--text-muted)',
                border: group === g ? '1px solid rgba(230,57,70,0.4)' : '1px solid var(--border-subtle)',
              }}>
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Matches */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      ) : Object.keys(byDate).length === 0 ? (
        <div className="py-16 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No hay partidos para esta fase/grupo</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, dayMatches]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                  {format(new Date(date + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es })}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {dayMatches.map(m => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
