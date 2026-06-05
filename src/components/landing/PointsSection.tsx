'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crosshair, CheckCircle, Equal, Zap, Trophy, Star, Sliders } from 'lucide-react'

const pointCards = [
  { Icon: Crosshair, title: 'Resultado exacto',   example: 'Ej: 2-1 y aciertas 2-1',        pts: 3,   gold: false },
  { Icon: CheckCircle, title: 'Ganador correcto', example: 'Ej: gana local y lo aciertas',   pts: 1,   gold: false },
  { Icon: Equal,       title: 'Empate acertado',  example: 'Ej: 0-0 y pronosticas empate',   pts: 1,   gold: false },
  { Icon: Zap,         title: 'Bonus eliminatoria', example: 'Exacto en octavos o más',      pts: '+1', gold: false },
  { Icon: Trophy,      title: 'Campeón del mundo', example: 'Pronóstico especial pre-torneo', pts: 15,  gold: true },
  { Icon: Star,        title: 'Cada semifinalista', example: 'Pronóstico especial pre-torneo', pts: 5, gold: false },
]

function PointCard({ card, i }: { card: typeof pointCards[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: i * 0.08 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-xl p-5 overflow-hidden cursor-default backdrop-blur-sm"
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderTop: '2px solid #e63946',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <card.Icon size={20} color="#e63946" />
        <span
          className="font-bebas text-4xl leading-none"
          style={{ color: card.gold ? '#ffd60a' : 'white' }}
        >
          {card.pts}
        </span>
      </div>

      <h3 className="font-oswald font-bold text-base mb-1 uppercase" style={{ color: 'var(--text-primary)' }}>
        {card.title}
      </h3>

      <p className="text-xs leading-relaxed transition-opacity duration-200"
        style={{ color: 'var(--text-muted)', opacity: hovered ? 1 : 0.65 }}>
        {card.example}
      </p>
    </motion.div>
  )
}

// Interactive simulator
function ScoreControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-10 h-10 rounded-full font-bold text-lg transition-all hover:bg-red-600"
        style={{ border: '1px solid #e63946', color: '#e63946', background: 'transparent' }}
      >−</button>
      <span className="font-bebas w-12 text-center text-white" style={{ fontSize: '3rem', lineHeight: 1 }}>
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 rounded-full font-bold text-lg transition-all hover:bg-red-600"
        style={{ border: '1px solid #e63946', color: '#e63946', background: 'transparent' }}
      >+</button>
    </div>
  )
}

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
    ? `¡Resultado exacto!${isKnockout ? ' +1 bonus eliminatoria' : ''}`
    : isCorrect ? 'Acertaste el ganador / empate'
    : 'No acertaste'

  const resultColor = pts >= 3 ? '#e63946' : pts === 1 ? '#ffd60a' : '#6c757d'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-12 rounded-lg p-6 md:p-8"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderTop: '3px solid #e63946',
        borderLeft: '1px solid rgba(230,57,70,0.3)',
        borderRight: '1px solid rgba(230,57,70,0.3)',
        borderBottom: '1px solid rgba(230,57,70,0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Sliders size={20} color="#e63946" />
        <div>
          <h3 className="font-bebas text-2xl uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
            Simulador de Puntos
          </h3>
          <p className="text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Ingresa un marcador y ve cuántos puntos ganarías
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-7">
          {/* Real result */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#6c757d' }}>
              Resultado Real
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest mb-2 text-center" style={{ color: '#6c757d' }}>Local</p>
                <div className="flex justify-center">
                  <ScoreControl value={home} onChange={setHome} />
                </div>
              </div>
              <span className="font-bebas text-3xl pb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest mb-2 text-center" style={{ color: '#6c757d' }}>Visitante</p>
                <div className="flex justify-center">
                  <ScoreControl value={away} onChange={setAway} />
                </div>
              </div>
            </div>
          </div>

          {/* My prediction */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#6c757d' }}>
              Mi Pronóstico
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest mb-2 text-center" style={{ color: '#6c757d' }}>Local</p>
                <div className="flex justify-center">
                  <ScoreControl value={predHome} onChange={setPredHome} />
                </div>
              </div>
              <span className="font-bebas text-3xl pb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest mb-2 text-center" style={{ color: '#6c757d' }}>Visitante</p>
                <div className="flex justify-center">
                  <ScoreControl value={predAway} onChange={setPredAway} />
                </div>
              </div>
            </div>
          </div>

          {/* Knockout toggle */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setIsKnockout(!isKnockout)}
              className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
              style={{ background: isKnockout ? '#e63946' : 'rgba(255,255,255,0.1)' }}
            >
              <motion.div
                animate={{ x: isKnockout ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white"
              />
            </button>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Fase eliminatoria{' '}
              <span style={{ color: '#6c757d' }}>(+1 si exacto)</span>
            </span>
          </div>
        </div>

        {/* Result panel */}
        <div
          className="flex flex-col items-center justify-center p-8 rounded-lg"
          style={{
            background: '#0a0a0f',
            borderLeft: '3px solid #e63946',
          }}
        >
          <motion.div
            key={pts}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="font-bebas leading-none"
            style={{ fontSize: '6rem', color: resultColor }}
          >
            {pts}
          </motion.div>
          <p className="text-xs uppercase tracking-[0.3em] mt-1 mb-4" style={{ color: '#6c757d' }}>
            {pts === 1 ? 'punto' : 'puntos'}
          </p>
          <motion.p
            key={resultLabel}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-center font-semibold"
            style={{ color: 'white' }}
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
