'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    icon: '🏆',
    title: 'INSCRÍBETE',
    desc: 'El administrador crea tu cuenta y pagas la cuota de inscripción para entrar al pozo.',
    color: 'rgba(230,57,70,0.15)',
    border: 'rgba(230,57,70,0.3)',
  },
  {
    num: '02',
    icon: '🎯',
    title: 'PRONOSTICA',
    desc: 'Predice el marcador exacto de cada partido antes de que empiece. Tienes hasta 1 hora antes del pitazo.',
    color: 'rgba(33,150,243,0.12)',
    border: 'rgba(33,150,243,0.25)',
  },
  {
    num: '03',
    icon: '📊',
    title: 'ACUMULA PUNTOS',
    desc: 'Gana 3 pts por resultado exacto, 1 pt por acertar ganador o empate. Los puntos se calculan automáticamente.',
    color: 'rgba(76,175,80,0.12)',
    border: 'rgba(76,175,80,0.25)',
  },
  {
    num: '04',
    icon: '💰',
    title: 'GANA EL POZO',
    desc: 'Al terminar el Mundial, el podio se reparte el pozo: 60% para el 1°, 25% para el 2° y 15% para el 3°.',
    color: 'rgba(255,214,10,0.1)',
    border: 'rgba(255,214,10,0.3)',
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-subtle)' }} />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(230,57,70,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-red)' }}>
            — Es muy sencillo —
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
            CÓMO FUNCIONA
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative rounded-3xl p-7 overflow-hidden cursor-default group"
              style={{
                background: step.color,
                border: `1px solid ${step.border}`,
              }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 0 30px ${step.border}`, borderRadius: 'inherit' }} />

              {/* Big decorative number */}
              <div
                className="absolute top-4 right-4 font-bebas leading-none select-none pointer-events-none"
                style={{
                  fontSize: '7rem',
                  color: 'rgba(255,255,255,0.04)',
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-5">{step.icon}</div>

              {/* Step number badge */}
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mb-3"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                Paso {step.num}
              </div>

              <h3 className="font-oswald text-2xl font-bold mb-3 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Connector line (desktop only) */}
        <div className="hidden lg:block relative mt-8">
          <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), rgba(230,57,70,0.3), transparent)' }} />
        </div>
      </div>
    </section>
  )
}
