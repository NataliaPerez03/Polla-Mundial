'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Lock, Clock, CheckCircle, Loader2, Trophy } from 'lucide-react'
import { getFlagUrl } from '@/lib/utils'

type Match = {
  id: string; matchNumber: number; homeTeam: string; awayTeam: string
  homeFlag: string; awayFlag: string; homeCode: string; awayCode: string
  phase: string; group: string | null
  scheduledAt: string; status: string
  predictions: { homeScore: number; awayScore: number }[]
}

// eslint-disable-next-line @next/next/no-img-element
const TeamFlag = ({ code, name }: { code: string; name: string }) => (
  <img src={getFlagUrl(code)} alt={name} width={48} height={36} className="rounded object-cover mx-auto" />
)

function ScoreInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => !disabled && onChange(String(Math.max(0, parseInt(value || '0') - 1)))}
        disabled={disabled}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
      >−</button>
      <input
        type="number" min="0" max="99" value={value} disabled={disabled}
        onChange={e => onChange(e.target.value.replace(/\D/, ''))}
        className="w-12 h-10 text-center font-bebas text-2xl rounded-xl outline-none transition-all input-red disabled:opacity-40"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
      />
      <button
        onClick={() => !disabled && onChange(String(parseInt(value || '0') + 1))}
        disabled={disabled}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
      >+</button>
    </div>
  )
}

function PredictionCard({ match, onSave }: { match: Match; onSave: () => void }) {
  const existing = match.predictions?.[0]
  const [home, setHome] = useState(existing?.homeScore?.toString() ?? '')
  const [away, setAway] = useState(existing?.awayScore?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const deadline = new Date(match.scheduledAt).getTime() - 3600000
  const locked = Date.now() >= deadline || match.status !== 'SCHEDULED'
  const hasChanged = home !== existing?.homeScore?.toString() || away !== existing?.awayScore?.toString()

  async function save() {
    if (locked || home === '' || away === '') return
    setSaving(true)
    await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: match.id, homeScore: parseInt(home), awayScore: parseInt(away) }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSave()
  }

  const timeUntil = Math.max(0, deadline - Date.now())
  const hoursLeft = Math.floor(timeUntil / 3600000)
  const minutesLeft = Math.floor((timeUntil % 3600000) / 60000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 transition-all"
      style={{
        background: 'var(--bg-card)',
        border: locked ? '1px solid rgba(255,255,255,0.04)' : '1px solid var(--border-subtle)',
        opacity: locked ? 0.7 : 1,
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{match.matchNumber}</span>
          {match.group && (
            <span
              className="text-xs px-2 py-0.5 rounded-sm"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              Gr. {match.group}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          {locked ? (
            <span className="flex items-center gap-1" style={{ color: '#e63946' }}>
              <Lock className="w-3 h-3" /> Cerrado
            </span>
          ) : hoursLeft < 3 ? (
            <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <Clock className="w-3 h-3" /> {hoursLeft}h {minutesLeft}m
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              {format(new Date(match.scheduledAt), "d MMM · HH:mm", { locale: es })}
            </span>
          )}
        </div>
      </div>

      {/* Teams & score inputs */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamFlag code={match.homeCode} name={match.homeTeam} />
          <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
            {match.homeTeam}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ScoreInput value={home} onChange={setHome} disabled={locked} />
          <span className="font-bebas text-xl" style={{ color: 'var(--text-muted)' }}>–</span>
          <ScoreInput value={away} onChange={setAway} disabled={locked} />
        </div>

        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamFlag code={match.awayCode} name={match.awayTeam} />
          <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
            {match.awayTeam}
          </span>
        </div>
      </div>

      {!locked && home !== '' && away !== '' && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={save}
            disabled={saving || (!hasChanged && !!existing)}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            style={{ background: saved ? '#4caf50' : 'var(--accent-red)', boxShadow: saved ? 'none' : '0 0 15px rgba(230,57,70,0.3)' }}
          >
            {saving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : saved
                ? <><CheckCircle className="w-4 h-4" /> Guardado</>
                : 'Guardar pronóstico'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default function MisPronosticosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [special, setSpecial] = useState<{ champion: string } | null>(null)
  const [championInput, setChampionInput] = useState('')
  const [savingSpecial, setSavingSpecial] = useState(false)

  const load = useCallback(() => {
    fetch('/api/matches?status=SCHEDULED')
      .then(r => r.json())
      .then(setMatches)
    fetch('/api/predictions/special')
      .then(r => r.json())
      .then(d => { if (d && !d.error) setSpecial(d) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function saveSpecial() {
    if (!championInput.trim()) return
    setSavingSpecial(true)
    await fetch('/api/predictions/special', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ champion: championInput, semi1: '', semi2: '', semi3: '', semi4: '' }),
    })
    setSavingSpecial(false)
    load()
  }

  const byDate = matches.reduce<Record<string, Match[]>>((acc, m) => {
    const key = format(new Date(m.scheduledAt), 'yyyy-MM-dd')
    acc[key] = [...(acc[key] ?? []), m]
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Special prediction card — champion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl p-8 overflow-hidden backdrop-blur-sm w-full"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,214,10,0.3)' }}
      >
        {/* Decorative "15" background */}
        <div
          className="absolute bottom-2 right-4 font-bebas leading-none select-none pointer-events-none"
          style={{ fontSize: '7rem', color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}
        >
          15
        </div>

        <div className="flex items-center gap-3 mb-4 relative">
          <Trophy className="w-6 h-6 flex-shrink-0" style={{ color: '#ffd60a' }} />
          <div>
            <h3 className="font-oswald text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Pronóstico Especial — Campeón
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Vale 15 puntos si aciertas</p>
          </div>
        </div>

        {special?.champion ? (
          <div className="flex items-center gap-3 p-3 rounded-xl relative"
            style={{ background: 'rgba(255,214,10,0.06)', border: '1px solid rgba(255,214,10,0.15)' }}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ffd60a' }} />
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Tu campeón: <strong>{special.champion}</strong>
            </span>
          </div>
        ) : (
          <div className="flex gap-3 relative">
            <input
              value={championInput}
              onChange={e => setChampionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveSpecial() }}
              placeholder="Ej: Argentina, Brasil, Francia..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all input-red"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={saveSpecial}
              disabled={savingSpecial || !championInput.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80 disabled:opacity-50 flex items-center gap-2"
              style={{ background: '#e63946' }}
            >
              {savingSpecial ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Match predictions */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-36 rounded-2xl skeleton" />)}
        </div>
      ) : Object.keys(byDate).length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <h3 className="font-oswald text-xl mb-2" style={{ color: 'var(--text-primary)' }}>¡Al día!</h3>
          <p style={{ color: 'var(--text-muted)' }}>No hay partidos próximos disponibles</p>
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
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dayMatches.length} partidos</span>
              </div>
              <div className="space-y-3">
                {dayMatches.map(m => <PredictionCard key={m.id} match={m} onSave={load} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
