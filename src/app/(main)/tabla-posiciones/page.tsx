'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Trophy, Search } from 'lucide-react'

type Player = {
  id: string; name: string; email: string
  totalPoints: number; exactPredictions: number; correctPredictions: number
  paid: boolean
}

function Medal({ pos }: { pos: number }) {
  if (pos === 1) return <span className="text-2xl">🥇</span>
  if (pos === 2) return <span className="text-2xl">🥈</span>
  if (pos === 3) return <span className="text-2xl">🥉</span>
  return <span className="font-bebas text-xl" style={{ color: 'var(--text-muted)' }}>#{pos}</span>
}

function PodiumCard({ player, pos }: { player: Player; pos: number }) {
  const colors: Record<number, { bg: string; border: string; glow: string }> = {
    1: { bg: 'rgba(255,214,10,0.08)', border: 'rgba(255,214,10,0.3)', glow: 'var(--accent-gold)' },
    2: { bg: 'rgba(173,181,189,0.08)', border: 'rgba(173,181,189,0.25)', glow: 'var(--accent-silver)' },
    3: { bg: 'rgba(205,124,58,0.08)', border: 'rgba(205,124,58,0.25)', glow: 'var(--accent-bronze)' },
  }
  const c = colors[pos]
  return (
    <motion.div
      initial={{ opacity: 0, y: pos === 1 ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: pos * 0.1 }}
      className={`rounded-2xl p-5 text-center ${pos === 1 ? 'scale-105' : ''}`}
      style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 30px ${c.glow}20` }}
    >
      <div className="mb-2"><Medal pos={pos} /></div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-2"
        style={{ background: `${c.glow}20`, color: c.glow, border: `1px solid ${c.glow}30` }}>
        {player.name.charAt(0).toUpperCase()}
      </div>
      <div className="font-oswald font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{player.name}</div>
      <div className="font-bebas text-3xl" style={{ color: c.glow }}>{player.totalPoints}</div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>pts</div>
      <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        {player.exactPredictions} exactos · {player.correctPredictions} correctos
      </div>
    </motion.div>
  )
}

export default function TablaPage() {
  const { data: session } = useSession()
  const [standings, setStandings] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/api/standings')
      .then(r => r.json())
      .then(d => { setStandings(d); setLoading(false) })
  }, [])

  const filtered = standings.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const displayed = showAll ? filtered : filtered.slice(0, 10)
  const top3 = standings.slice(0, 3)
  const myRank = standings.findIndex(p => p.id === session?.user?.id) + 1

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="h-40 rounded-2xl skeleton" />
      <div className="h-96 rounded-2xl skeleton" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          <PodiumCard player={top3[1]} pos={2} />
          <PodiumCard player={top3[0]} pos={1} />
          <PodiumCard player={top3[2]} pos={3} />
        </div>
      )}

      {/* My rank banner */}
      {myRank > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'linear-gradient(90deg,rgba(230,57,70,0.12),rgba(230,57,70,0.04))', border: '1px solid rgba(230,57,70,0.25)' }}>
          <Trophy className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
          <span className="font-oswald font-bold" style={{ color: 'var(--text-primary)' }}>Tu posición:</span>
          <span className="font-bebas text-2xl" style={{ color: 'var(--accent-red)' }}>#{myRank}</span>
          <span style={{ color: 'var(--text-muted)' }}>de {standings.length} participantes</span>
          <div className="ml-auto font-bebas text-2xl" style={{ color: 'var(--text-primary)' }}>
            {standings[myRank - 1]?.totalPoints ?? 0} pts
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
        {/* Search bar */}
        <div className="p-4" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar participante..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all input-red"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Participante</div>
          <div className="col-span-2 text-center">Pts</div>
          <div className="col-span-2 text-center hidden sm:block">Exactos</div>
          <div className="col-span-2 text-center hidden sm:block">Correctos</div>
        </div>

        {/* Rows */}
        <div style={{ background: 'var(--bg-card)' }}>
          {displayed.map((player, i) => {
            const realPos = standings.indexOf(player) + 1
            const isMe = player.id === session?.user?.id
            return (
              <motion.div key={player.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-all ${isMe ? 'row-me' : 'hover:bg-white/[0.02]'}`}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div className="col-span-1 flex justify-center">
                  {realPos <= 3
                    ? <Medal pos={realPos} />
                    : <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{realPos}</span>}
                </div>
                <div className="col-span-5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: isMe ? 'rgba(230,57,70,0.2)' : 'rgba(255,255,255,0.07)',
                      color: isMe ? 'var(--accent-red)' : 'var(--text-secondary)',
                    }}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {player.name}{isMe && ' (tú)'}
                    </div>
                    {!player.paid && (
                      <span className="text-[10px]" style={{ color: '#ff9800' }}>⏳ Pago pendiente</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-center font-bebas text-xl" style={{ color: isMe ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                  {player.totalPoints}
                </div>
                <div className="col-span-2 text-center text-sm hidden sm:block" style={{ color: '#4caf50' }}>
                  {player.exactPredictions}
                </div>
                <div className="col-span-2 text-center text-sm hidden sm:block" style={{ color: '#64b5f6' }}>
                  {player.correctPredictions}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Show more */}
        {filtered.length > 10 && (
          <div className="p-4 text-center" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(230,57,70,0.2)' }}>
              {showAll ? 'Ver menos' : `Ver todos (${filtered.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
