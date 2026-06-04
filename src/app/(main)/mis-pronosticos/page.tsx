'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Lock, Clock, CheckCircle, Loader2, Trophy } from 'lucide-react'

type Match = {
  id: string; matchNumber: number; homeTeam: string; awayTeam: string
  homeFlag: string; awayFlag: string; phase: string; group: string | null
  scheduledAt: string; status: string
  predictions: { homeScore: number; awayScore: number }[]
}

function ScoreInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => !disabled && onChange(String(Math.max(0, parseInt(value || '0') - 1)))}
        disabled={disabled}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
        −
      </button>
      <input
        type="number" min="0" max="99" value={value} disabled={disabled}
        onChange={e => onChange(e.target.value.replace(/\D/, ''))}
        className="w-12 h-10 text-center font-bebas text-2xl rounded-xl outline-none transition-all input-red disabled:opacity-40"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
      />
      <button onClick={() => !disabled && onChange(String(parseInt(value || '0') + 1))}
        disabled={disabled}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
        +
      </button>
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
        opacity: locked ? 0.75 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{match.matchNumber}</span>
          {match.group && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Gr. {match.group}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: locked ? 'var(--accent-red)' : 'var(--text-muted)' }}>
          {locked ? <><Lock className="w-3 h-3" /> Cerrado</> : (
            hoursLeft < 3
              ? <><Clock className="w-3 h-3" /> {hoursLeft}h {minutesLeft}m</>
              : format(new Date(match.scheduledAt), "d MMM · HH:mm", { locale: es })
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-3xl">{match.homeFlag}</span>
          <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>{match.homeTeam}</span>
        </div>

        <div className="flex items-center gap-2">
          <ScoreInput value={home} onChange={setHome} disabled={locked} />
          <span className="font-bebas text-xl" style={{ color: 'var(--text-muted)' }}>–</span>
          <ScoreInput value={away} onChange={setAway} disabled={locked} />
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-3xl">{match.awayFlag}</span>
          <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>{match.awayTeam}</span>
        </div>
      </div>

      {!locked && home !== '' && away !== '' && (
        <div className="mt-4 flex justify-center">
          <button onClick={save} disabled={saving || (!hasChanged && !!existing)}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            style={{ background: saved ? '#4caf50' : 'var(--accent-red)', boxShadow: saved ? 'none' : '0 0 15px rgba(230,57,70,0.3)' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><CheckCircle className="w-4 h-4" /> Guardado</> : 'Guardar pronóstico'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default function MisPronosticosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [special, setSpecial] = useState<{ champion: string; semi1: string; semi2: string; semi3: string; semi4: string } | null>(null)
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Special prediction */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg,rgba(255,214,10,0.08),rgba(255,214,10,0.03))', border: '1px solid rgba(255,214,10,0.2)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
          <div>
            <h3 className="font-oswald text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Pronóstico Especial — Campeón
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Vale 15 puntos si aciertas</p>
          </div>
        </div>
        {special?.champion ? (
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.2)' }}>
            <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Tu campeón: <strong>{special.champion}</strong>
            </span>
          </div>
        ) : (
          <div className="flex gap-3">
            <input value={championInput} onChange={e => setChampionInput(e.target.value)}
              placeholder="Ej: Argentina, Brasil, Francia..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all input-red"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,214,10,0.2)', color: 'var(--text-primary)' }}
            />
            <button onClick={saveSpecial} disabled={savingSpecial || !championInput.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'var(--accent-gold)', color: '#000' }}>
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
