'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function useAnimatedNumber(target: number, duration = 1800) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    const steps = 60
    const inc = target / steps
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + inc, target)
      setValue(Math.round(cur))
      if (cur >= target) clearInterval(id)
    }, duration / steps)
    return () => clearInterval(id)
  }, [inView, target, duration])

  return { value, ref }
}

function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const { value, ref } = useAnimatedNumber(target)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 150 }}
      className="text-center p-6 rounded-2xl"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <div
        className="font-bebas leading-none mb-2"
        style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          background: 'linear-gradient(135deg, #e63946, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <span ref={ref}>{value}</span>{suffix}
      </div>
      <div className="font-oswald font-semibold text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </motion.div>
  )
}

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

export function WhatIsSection() {
  return (
    <section
      id="que-es"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-subtle)' }} />
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(230,57,70,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="w-12 h-0.5 bg-red-600 mb-6" />
            <h2
              className="font-bebas leading-none mb-8"
              style={{
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                background: 'linear-gradient(135deg, #ffffff, #aaaaaa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ¿QUÉ ES?
            </h2>

            <div className="space-y-5" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              <p>
                La <strong style={{ color: 'var(--text-primary)' }}>Polla Mundial 2026</strong> es un torneo de pronósticos entre amigos donde cada participante
                predice los resultados de los 104 partidos del Mundial de la FIFA. Quien más puntos acumule al final, gana.
              </p>
              <p>
                Es simple: antes de que empiece cada partido, ingresas el marcador que crees que va a terminar.
                Si aciertas el resultado exacto ganas <strong style={{ color: 'var(--accent-red)' }}>3 puntos</strong>,
                si solo aciertas el ganador o el empate, ganas <strong style={{ color: 'var(--accent-red)' }}>1 punto</strong>.
              </p>
              <p>
                Además puedes ganar hasta{' '}
                <strong style={{ color: 'var(--accent-gold)' }}>15 puntos extra</strong>{' '}
                si adivinas quién será el campeón del mundo. El que tenga más puntos al final se lleva el pozo.
              </p>
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <StatCounter target={104} label="Partidos" />
              <StatCounter target={48} label="Selecciones" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCounter target={32} label="Días de torneo" />
              <StatCounter target={30} suffix="+" label="Participantes" />
            </div>

            {/* Editorial data strip */}
            <div className="flex items-center gap-0 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {[
                '11 Jun — 19 Jul 2026',
                '16 Estadios',
                '3 Países Sede',
              ].map((item, i) => (
                <div key={item} className="flex items-center">
                  {i > 0 && <div className="w-px h-3 mx-4" style={{ background: 'var(--text-muted)' }} />}
                  <span className="text-xs uppercase tracking-widest text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
