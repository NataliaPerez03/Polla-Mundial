'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Save, Users, Settings, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

type Match = {
  id: string; matchNumber: number; homeTeam: string; awayTeam: string
  homeFlag: string; awayFlag: string; scheduledAt: string
  homeScore: number | null; awayScore: number | null; status: string
}
type User = { id: string; name: string; email: string; totalPoints: number; paid: boolean; role: string }
type Config = { exactScore: number; correctResult: number; champion: number; semifinalist: number; bonusKnockout: number }

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: active ? 'var(--accent-red)' : 'var(--bg-elevated)',
        color: active ? 'white' : 'var(--text-secondary)',
        boxShadow: active ? '0 0 15px rgba(230,57,70,0.3)' : 'none',
      }}>
      {children}
    </button>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<'results' | 'users' | 'config'>('results')
  const [matches, setMatches] = useState<Match[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [cfgSaving, setCfgSaving] = useState(false)

  const load = useCallback(() => {
    fetch('/api/matches').then(r => r.json()).then(setMatches)
    fetch('/api/users').then(r => r.json()).then(setUsers)
    fetch('/api/config').then(r => r.json()).then(setConfig)
  }, [])

  useEffect(() => { load() }, [load])

  const pending = matches.filter(m => m.status !== 'FINISHED' && new Date(m.scheduledAt) < new Date())
  const finished = matches.filter(m => m.status === 'FINISHED')

  async function saveResult(matchId: string) {
    const s = scores[matchId]
    if (!s || s.home === '' || s.away === '') return
    setSaving(prev => ({ ...prev, [matchId]: true }))
    await fetch(`/api/matches/${matchId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeScore: parseInt(s.home), awayScore: parseInt(s.away), status: 'FINISHED' }),
    })
    setSaving(prev => ({ ...prev, [matchId]: false }))
    setSaved(prev => ({ ...prev, [matchId]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [matchId]: false })), 2000)
    load()
  }

  async function togglePaid(userId: string, paid: boolean) {
    await fetch(`/api/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paid }) })
    load()
  }

  async function saveConfig() {
    if (!config) return
    setCfgSaving(true)
    await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
    setCfgSaving(false)
    load()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg,rgba(230,57,70,0.1),rgba(230,57,70,0.04))', border: '1px solid rgba(230,57,70,0.25)' }}>
        <div>
          <h2 className="font-oswald text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Panel de Administración</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {pending.length} partidos pendientes · {users.length} usuarios · {users.filter(u => u.paid).length} pagados
          </p>
        </div>
        {pending.length > 0 && (
          <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(230,57,70,0.12)', color: 'var(--accent-red)' }}>
            <AlertCircle className="w-4 h-4" />
            {pending.length} sin resultado
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabButton active={tab === 'results'} onClick={() => setTab('results')}>
          ⚽ Resultados
        </TabButton>
        <TabButton active={tab === 'users'} onClick={() => setTab('users')}>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Usuarios</span>
        </TabButton>
        <TabButton active={tab === 'config'} onClick={() => setTab('config')}>
          <span className="flex items-center gap-1.5"><Settings className="w-4 h-4" /> Configuración</span>
        </TabButton>
      </div>

      {/* Results tab */}
      {tab === 'results' && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="rounded-2xl p-12 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#4caf50', opacity: 0.5 }} />
              <h3 className="font-oswald text-xl" style={{ color: 'var(--text-primary)' }}>¡Todo al día!</h3>
              <p style={{ color: 'var(--text-muted)' }}>No hay partidos pendientes de resultado</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full animate-pulse-red" style={{ background: 'var(--accent-red)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-red)' }}>
                  Partidos sin resultado ({pending.length})
                </span>
              </div>
              {pending.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{m.homeFlag}</span>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{m.homeTeam}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {format(new Date(m.scheduledAt), "d MMM · HH:mm", { locale: es })}
                        </div>
                      </div>
                      <span className="font-bebas text-lg mx-2" style={{ color: 'var(--text-muted)' }}>vs</span>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{m.awayTeam}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>#{m.matchNumber}</div>
                      </div>
                      <span className="text-2xl">{m.awayFlag}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="number" min="0" max="99" placeholder="0"
                        value={scores[m.id]?.home ?? ''}
                        onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], home: e.target.value } }))}
                        className="w-14 h-10 text-center font-bebas text-xl rounded-xl outline-none input-red"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                      />
                      <span className="font-bebas text-xl" style={{ color: 'var(--text-muted)' }}>–</span>
                      <input type="number" min="0" max="99" placeholder="0"
                        value={scores[m.id]?.away ?? ''}
                        onChange={e => setScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], away: e.target.value } }))}
                        className="w-14 h-10 text-center font-bebas text-xl rounded-xl outline-none input-red"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                      />
                      <button onClick={() => saveResult(m.id)}
                        disabled={saving[m.id] || !scores[m.id]?.home || !scores[m.id]?.away}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-40"
                        style={{ background: saved[m.id] ? '#4caf50' : 'var(--accent-red)' }}>
                        {saving[m.id]
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : saved[m.id]
                            ? <><CheckCircle className="w-4 h-4" /> Guardado</>
                            : <><Save className="w-4 h-4" /> Guardar</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}

          {/* Recent finished */}
          {finished.slice(-5).length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                Últimos resultados cargados
              </h4>
              {finished.slice(-5).reverse().map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl mb-2"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xl">{m.homeFlag}</span>
                  <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                    {m.homeTeam} <span className="font-bebas text-base mx-2" style={{ color: 'var(--text-primary)' }}>{m.homeScore}–{m.awayScore}</span> {m.awayTeam}
                  </span>
                  <span className="text-xl">{m.awayFlag}</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs" style={{ background: 'rgba(76,175,80,0.1)', color: '#4caf50' }}>
                    ✓ Cargado
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="col-span-4">Nombre</div>
            <div className="col-span-3 hidden sm:block">Email</div>
            <div className="col-span-2 text-center">Puntos</div>
            <div className="col-span-2 text-center">Pago</div>
            <div className="col-span-1 text-center">Rol</div>
          </div>
          {users.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-2 px-4 py-3 items-center"
              style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent-red)' }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</span>
              </div>
              <div className="col-span-3 hidden sm:block text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</div>
              <div className="col-span-2 text-center font-bebas text-lg" style={{ color: 'var(--text-primary)' }}>{u.totalPoints}</div>
              <div className="col-span-2 flex justify-center">
                <button onClick={() => togglePaid(u.id, !u.paid)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: u.paid ? 'rgba(76,175,80,0.12)' : 'rgba(255,152,0,0.1)',
                    color: u.paid ? '#4caf50' : '#ff9800',
                    border: u.paid ? '1px solid rgba(76,175,80,0.2)' : '1px solid rgba(255,152,0,0.2)',
                  }}>
                  {u.paid ? '✓ Pagado' : '⏳ Pendiente'}
                </button>
              </div>
              <div className="col-span-1 flex justify-center">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: u.role === 'ADMIN' ? 'rgba(230,57,70,0.12)' : 'rgba(255,255,255,0.05)', color: u.role === 'ADMIN' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                  {u.role === 'ADMIN' ? 'Admin' : 'User'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Config tab */}
      {tab === 'config' && config && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-oswald text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Sistema de puntos</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { key: 'exactScore', label: 'Resultado exacto', desc: 'Puntos por acertar marcador' },
              { key: 'correctResult', label: 'Ganador/empate correcto', desc: 'Puntos por tendencia' },
              { key: 'bonusKnockout', label: 'Bonus eliminatoria', desc: 'Bonus extra por exacto en playoff' },
              { key: 'champion', label: 'Campeón mundial', desc: 'Puntos por pronóstico especial' },
              { key: 'semifinalist', label: 'Cada semifinalista', desc: 'Puntos por pronóstico especial' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</label>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setConfig(prev => prev ? { ...prev, [key]: Math.max(0, prev[key as keyof Config] - 1) } : prev)}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>−</button>
                  <span className="font-bebas text-3xl w-12 text-center" style={{ color: 'var(--accent-red)' }}>
                    {config[key as keyof Config]}
                  </span>
                  <button onClick={() => setConfig(prev => prev ? { ...prev, [key]: prev[key as keyof Config] + 1 } : prev)}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>+</button>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>pts</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={saveConfig} disabled={cfgSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-60"
            style={{ background: 'var(--accent-red)', boxShadow: '0 0 20px rgba(230,57,70,0.3)' }}>
            {cfgSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar configuración
          </button>
        </div>
      )}
    </div>
  )
}
