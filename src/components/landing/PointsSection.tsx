'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const pointCards = [
  { icon: '🎯', title: 'Resultado exacto', example: 'Ej: 2-1 y aciertas 2-1', pts: 3, color: '#4caf50', bg: 'rgba(76,175,80,0.1)', border: 'rgba(76,175,80,0.25)' },
  { icon: '✅', title: 'Ganador correcto', example: 'Ej: gana local y lo aciertas', pts: 1, color: '#64b5f6', bg: 'rgba(33,150,243,0.1)', border: 'rgba(33,150,243,0.25)' },
  { icon: '🤝', title: 'Empate acertado', example: 'Ej: 0-0 y pronosticas empate', pts: 1, color: '#64b5f6', bg: 'rgba(33,150,243,0.1)', border: 'rgba(33,150,243,0.25)' },
  { icon: '⚡', title: 'Bonus eliminatoria', example: 'Exacto en octavos o más', pts: '+1', color: '#ff9800', bg: 'rgba(255,152,0,0.1)', border: 'rgba(255,152,0,0.25)' },
  { icon: '🏆', title: 'Campeón del mundo', example: 'Pronóstico especial pre-torneo', pts: 15, color: '#ffd60a', bg: 'rgba(255,214,10,0.1)', border: 'rgba(255,214,10,0.35)', special: true },
  { icon: '⭐', title: 'Cada semifinalista', example: 'Pronóstico especial pre-torneo', pts: 5, color: '#e040fb', bg: 'rgba(224,64,251,0.08)', border: 'rgba(224,64,251,0.2)' },
]

function PointCard({ card, i }: { card: typeof pointCards[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: i * 0.08 }}
      whileHover={{ scale: 1.04, y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-5 overflow-hidden cursor-default"
      style={{
        background: card.special ? 'linear-gradient(135deg, rgba(255,214,10,0.12), rgba(255,214,10,0.04))' : card.bg,
        border: `1px solid ${card.border}`,
        boxShadow: card.special ? '0 0 30px rgba(255,214,10,0.1)' : undefined,
      }}
    >
      {card.special && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: 'rgba(255,214,10,0.2)', color: 'var(--accent-gold)' }}>
          ★ ESPECIAL
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{card.icon}</span>
        <span
          className="font-bebas text-4xl leading-none"
          style={{ color: card.color }}
        >
          {card.pts}
        </span>
      </div>

      <h3 className="font-oswald font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
        {card.title}
      </h3>

      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: hovered ? 1 : 0.6, height: 'auto' }}
        className="text-xs leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        {card.example}
      </motion.p>

      <div className="mt-3 flex items-center gap-1">
        <span className="text-xs font-semibold" style={{ color: card.color }}>
          {card.pts} {typeof card.pts === 'number' ? 'puntos' : 'punto extra'}
        </span>
        {hovered && (
          <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
            className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {' '}→ por acierto
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

// Interactive simulator
function Simulator() {
  const [home, setHome] = useState(2)
  const [away, setAway] = useState(1)
  const [predHome, setPredHome] = useState(2)
  const [predAway, setPredAway] = useState(1)
  const [isKnockout, setIsKnockout] = useState(false)

  const getResult = (h: number, a: number) => h > a ? 'H' : h < a ? 'A' : 'D'
  const realRes = getResult(home, away)
  const predRes = getResult(predHome, predAway)

  const isExact = home === predHome && away === predAway
  const isCorrect = realRes === predRes
  const pts = isExact ? (3 + (isKnockout ? 1 : 0)) : isCorrect ? 1 : 0

  const resultLabel = isExact
    ? `¡Resultado exacto! ${isKnockout ? '+1 bonus eliminatoria' : ''}`
    : isCorrect ? 'Acertaste el ganador/empate'
    : 'No acertaste 😔'

  const resultColor = isExact ? '#4caf50' : isCorrect ? '#64b5f6' : 'var(--text-muted)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-12 rounded-3xl p-6 md:p-8"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}>
          🧮
        </div>
        <div>
          <h3 className="font-oswald font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            Simulador de puntos
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Ingresa un marcador y ve cuántos puntos ganarías
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          {/* Real result */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-muted)' }}>
              Resultado real del partido
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setHome(Math.max(0, home - 1))}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>−</button>
                  <span className="font-bebas text-3xl w-10 text-center" style={{ color: 'var(--text-primary)' }}>{home}</span>
                  <button onClick={() => setHome(home + 1)}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>+</button>
                </div>
              </div>
              <span className="font-bebas text-2xl" style={{ color: 'var(--text-muted)' }}>–</span>
              <div className="flex-1 flex items-center gap-2 justify-end">
                <div className="flex items-center gap-1">
                  <button onClick={() => setAway(Math.max(0, away - 1))}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>−</button>
                  <span className="font-bebas text-3xl w-10 text-center" style={{ color: 'var(--text-primary)' }}>{away}</span>
                  <button onClick={() => setAway(away + 1)}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>+</button>
                </div>
                <span className="text-2xl">✈️</span>
              </div>
            </div>
          </div>

          {/* My prediction */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-muted)' }}>
              Mi pronóstico
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPredHome(Math.max(0, predHome - 1))}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>−</button>
                  <span className="font-bebas text-3xl w-10 text-center" style={{ color: 'var(--accent-red)' }}>{predHome}</span>
                  <button onClick={() => setPredHome(predHome + 1)}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>+</button>
                </div>
              </div>
              <span className="font-bebas text-2xl" style={{ color: 'var(--text-muted)' }}>–</span>
              <div className="flex-1 flex items-center gap-2 justify-end">
                <div className="flex items-center gap-1">
                  <button onClick={() => setPredAway(Math.max(0, predAway - 1))}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>−</button>
                  <span className="font-bebas text-3xl w-10 text-center" style={{ color: 'var(--accent-red)' }}>{predAway}</span>
                  <button onClick={() => setPredAway(predAway + 1)}
                    className="w-8 h-8 rounded-lg font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>+</button>
                </div>
                <span className="text-2xl">✈️</span>
              </div>
            </div>
          </div>

          {/* Knockout toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsKnockout(!isKnockout)}
              className="relative w-10 h-5 rounded-full transition-all duration-300"
              style={{ background: isKnockout ? 'var(--accent-red)' : 'rgba(255,255,255,0.1)' }}
            >
              <motion.div
                animate={{ x: isKnockout ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
              />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Fase eliminatoria <span style={{ color: 'var(--text-muted)' }}>(+1 bonus si exacto)</span>
            </span>
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Resultado:</p>
          <motion.div
            key={pts}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <span
              className="font-bebas leading-none"
              style={{ fontSize: '8rem', color: resultColor }}
            >
              {pts}
            </span>
          </motion.div>
          <p className="font-oswald font-bold text-lg" style={{ color: resultColor }}>
            {pts === 1 ? 'punto' : 'puntos'}
          </p>
          <motion.p
            key={resultLabel}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {resultLabel}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

export function PointsSection() {
  return (
    <section
      id="puntuacion"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-subtle)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.03) 0%, transparent 50%, rgba(255,214,10,0.02) 100%)' }} />

      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-red)' }}>
            — Así se puntúa —
          </p>
          <h2
            className="font-bebas leading-none"
            style={{
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              background: 'linear-gradient(135deg, #ffffff, #888888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SISTEMA DE PUNTOS
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Simple de entender, imposible de dominar. Cada partido cuenta.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pointCards.map((card, i) => (
            <PointCard key={card.title} card={card} i={i} />
          ))}
        </div>

        {/* Simulator */}
        <Simulator />
      </div>
    </section>
  )
}
