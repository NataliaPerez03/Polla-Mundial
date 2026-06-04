'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const standings = [
  { pos: 1, name: 'Carlos R.', pts: 87, exact: 12, correct: 23, paid: true },
  { pos: 2, name: 'Valentina G.', pts: 74, exact: 9, correct: 20, paid: true },
  { pos: 3, name: 'Sebastián T.', pts: 68, exact: 8, correct: 18, paid: true },
  { pos: 4, name: 'Camila M.', pts: 61, exact: 7, correct: 16, paid: true },
  { pos: 5, name: 'Andrés P.', pts: 55, exact: 6, correct: 14, paid: false },
]

const matches = [
  { home: '🇦🇷', homeTeam: 'Argentina', away: '🇫🇷', awayTeam: 'Francia', realScore: '3-3', myPred: '2-1', pts: 0, status: 'Finalizado' },
  { home: '🇧🇷', homeTeam: 'Brasil', away: '🇩🇪', awayTeam: 'Alemania', realScore: '2-0', myPred: '2-0', pts: 3, status: 'Finalizado', exact: true },
  { home: '🇪🇸', homeTeam: 'España', away: '🇵🇹', awayTeam: 'Portugal', realScore: '—', myPred: '1-1', pts: null, status: 'Próximo' },
]

const predictions = [
  { home: '🇺🇸', homeTeam: 'EE.UU.', away: '🇲🇽', awayTeam: 'México', date: '15 Jun · 20:00', predHome: 2, predAway: 1, locked: false },
  { home: '🇨🇦', homeTeam: 'Canadá', away: '🇨🇴', awayTeam: 'Colombia', date: '16 Jun · 18:00', predHome: '', predAway: '', locked: false },
  { home: '🇯🇵', homeTeam: 'Japón', away: '🇰🇷', awayTeam: 'Corea del Sur', date: '16 Jun · 14:00', predHome: 1, predAway: 2, locked: true },
]

const tabs = ['Tabla', 'Fixture', 'Mis Pronósticos']

function StandingsPreview() {
  return (
    <div className="space-y-2">
      {standings.map((p) => (
        <div key={p.pos} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: p.pos === 1 ? 'rgba(255,214,10,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.pos === 1 ? 'rgba(255,214,10,0.2)' : 'var(--border-subtle)'}` }}>
          <div className="w-7 text-center">
            {p.pos === 1 ? '🥇' : p.pos === 2 ? '🥈' : p.pos === 3 ? '🥉' : (
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{p.pos}</span>
            )}
          </div>
          <div className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
          <div className="font-bebas text-xl" style={{ color: p.pos === 1 ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{p.pts}</div>
          <div className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>{p.exact} exactos</div>
          {!p.paid && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,152,0,0.1)', color: '#ff9800' }}>⏳</span>}
        </div>
      ))}
    </div>
  )
}

function FixturePreview() {
  return (
    <div className="space-y-2">
      {matches.map((m, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{m.home}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{m.homeTeam}</span>
          </div>
          <div className="text-center">
            <div className="font-bebas text-lg" style={{ color: m.status === 'Finalizado' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {m.realScore}
            </div>
            <div className="text-[10px]" style={{ color: m.status === 'Próximo' ? '#64b5f6' : 'var(--text-muted)' }}>{m.status}</div>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{m.awayTeam}</span>
            <span className="text-xl">{m.away}</span>
          </div>
          {m.pts !== null && (
            <span className="text-xs px-2 py-0.5 rounded font-bold ml-2"
              style={{ background: m.exact ? 'rgba(76,175,80,0.15)' : m.pts > 0 ? 'rgba(33,150,243,0.1)' : 'rgba(255,255,255,0.05)', color: m.exact ? '#4caf50' : m.pts > 0 ? '#64b5f6' : 'var(--text-muted)' }}>
              {m.pts > 0 ? `+${m.pts}` : '0'}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function PredictionsPreview() {
  return (
    <div className="space-y-3">
      {predictions.map((m, i) => (
        <div key={i} className="px-4 py-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', opacity: m.locked ? 0.6 : 1 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.date}</span>
            {m.locked && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--accent-red)' }}>🔒 Cerrado</span>}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{m.home}</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{m.homeTeam}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-9 rounded-lg flex items-center justify-center font-bebas text-xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: m.predHome !== '' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                {m.predHome !== '' ? m.predHome : '?'}
              </div>
              <span className="font-bebas text-xl" style={{ color: 'var(--text-muted)' }}>–</span>
              <div className="w-10 h-9 rounded-lg flex items-center justify-center font-bebas text-xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-subtle)', color: m.predAway !== '' ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                {m.predAway !== '' ? m.predAway : '?'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{m.awayTeam}</span>
              <span className="text-2xl">{m.away}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PreviewSection() {
  const [activeTab, setActiveTab] = useState(0)

  const tabContent = [<StandingsPreview key="s" />, <FixturePreview key="f" />, <PredictionsPreview key="p" />]

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-subtle)' }} />

      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-red)' }}>
            — Vista previa —
          </p>
          <h2
            className="font-bebas leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              background: 'linear-gradient(135deg, #ffffff, #888888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ASÍ SE VE POR DENTRO
          </h2>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
            Una plataforma limpia, intuitiva y hecha para ganar
          </p>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="rounded-t-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
            {/* Dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            </div>
            {/* URL bar */}
            <div className="flex-1 px-3 py-1 rounded-lg text-xs text-center"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
              localhost:3000/tabla-posiciones
            </div>
          </div>

          {/* App content */}
          <div className="rounded-b-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderTop: 'none' }}>
            {/* App header */}
            <div className="flex items-center justify-between px-5 py-3"
              style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: 'rgba(230,57,70,0.2)' }}>🏆</div>
                <span className="font-bebas text-sm tracking-widest text-white">POLLA MUNDIAL</span>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(230,57,70,0.2)', color: 'var(--accent-red)' }}>C</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-4 pb-2">
              {tabs.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: activeTab === i ? 'var(--accent-red)' : 'var(--bg-elevated)',
                    color: activeTab === i ? 'white' : 'var(--text-muted)',
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-4 pb-5 min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
