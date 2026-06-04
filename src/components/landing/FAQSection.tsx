'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: '¿Cuánto cuesta participar?',
    a: 'El administrador del grupo define la cuota de inscripción. Generalmente es un monto fijo que entra al pozo y se reparte entre los mejores al final del torneo.',
  },
  {
    q: '¿Hasta cuándo puedo pronosticar?',
    a: 'Tienes hasta 1 hora antes del inicio de cada partido. Pasado ese tiempo, el pronóstico queda bloqueado. Puedes modificar tus pronósticos cuantas veces quieras antes del cierre.',
  },
  {
    q: '¿Qué pasa si me olvido de pronosticar?',
    a: 'Ese partido te queda en 0 puntos. No se asignan puntos por omisión. Por eso te recomendamos ingresar todos los pronósticos de la jornada al inicio del día.',
  },
  {
    q: '¿Cuándo se reparten los puntos?',
    a: 'Los puntos se calculan automáticamente inmediatamente después de que el administrador cargue el resultado oficial del partido. La tabla se actualiza en tiempo real.',
  },
  {
    q: '¿Puedo ver los pronósticos de otros?',
    a: 'Solo podrás ver los pronósticos de los demás participantes una vez que el partido haya iniciado. Antes del pitazo inicial, los pronósticos son secretos.',
  },
  {
    q: '¿Quién reparte el dinero?',
    a: 'El administrador del grupo gestiona el pozo. Puede ver quién ha pagado y quién tiene el pago pendiente. Al finalizar el torneo, coordina el pago de los premios.',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.08 }}
      className="overflow-hidden rounded-2xl"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-all duration-200"
        style={{
          background: open
            ? 'linear-gradient(90deg, rgba(230,57,70,0.1) 0%, rgba(230,57,70,0.03) 100%)'
            : 'var(--bg-card)',
        }}
      >
        <span className="font-oswald text-lg font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: open ? 'rgba(230,57,70,0.2)' : 'rgba(255,255,255,0.06)',
            color: open ? 'var(--accent-red)' : 'var(--text-muted)',
          }}
        >
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="px-6 pb-5 pt-1">
              <div className="h-px mb-4" style={{ background: 'var(--border-subtle)' }} />
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 relative" style={{ background: 'var(--bg-secondary)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--border-subtle)' }} />

      <div className="max-w-3xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent-red)' }}>
            — Resolvemos tus dudas —
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
            PREGUNTAS FRECUENTES
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={i} {...item} index={i} />
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            ¿Tienes otra pregunta? Contáctale al administrador de tu grupo.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
