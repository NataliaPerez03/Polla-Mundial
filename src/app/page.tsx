'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, BarChart3, ChevronDown, ChevronRight, Zap, Shield, Globe2 } from 'lucide-react'

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return timeLeft
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!inView) return
    const steps = 60
    const inc = value / steps
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + inc, value)
      setDisplay(Math.round(cur))
      if (cur >= value) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [inView, value])
  return <span ref={ref}>{display}</span>
}

function Particles() {
  const items = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${(i * 6.25) % 100}%`,
    size: (i % 3) + 1,
    duration: 10 + (i % 8),
    delay: (i % 7) * 1.2,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

const faqs = [
  { q: '¿Cómo se calculan los puntos?', a: 'Resultado exacto: 3 pts. Ganador/empate correcto: 1 pt. En eliminatorias, el resultado exacto suma 1 punto bonus. Acertar al campeón vale 15 pts y cada semifinalista 5 pts.' },
  { q: '¿Hasta cuándo puedo hacer mis pronósticos?', a: 'Puedes hacer y modificar tus pronósticos hasta 1 hora antes del inicio de cada partido. Pasado ese tiempo quedan bloqueados.' },
  { q: '¿Qué pasa con los partidos de eliminatoria?', a: 'Puedes pronosticar los partidos de eliminatoria una vez que se conozcan los clasificados. El sistema te avisará cuando estén disponibles.' },
  { q: '¿Cómo funciona el pozo?', a: 'Cada participante paga una inscripción fija. El total recaudado se distribuye: 60% al primero, 25% al segundo y 15% al tercero.' },
  { q: '¿Puedo cambiar mis pronósticos?', a: 'Sí, puedes editarlos cuantas veces quieras antes del cierre de cada partido (1h antes del inicio). Una vez cerrado, quedan fijos.' },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.12 } } }

export default function LandingPage() {
  const kickoff = new Date('2026-06-11T20:00:00-05:00')
  const cd = useCountdown(kickoff)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#0a0a0f 0%,#12080c 40%,#1a0a0d 70%,#0a0a0f 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(230,57,70,0.12),transparent)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 20%,rgba(255,214,10,0.04),transparent 50%)' }} />
        <Particles />
        {/* grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-white" />
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white" />
        </div>

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-5 z-20">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
            <span className="font-bebas text-xl tracking-widest text-white">POLLA MUNDIAL</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2 rounded-lg text-sm font-medium transition-all" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              Ingresar
            </Link>
            <Link href="/registro" className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: 'var(--accent-red)' }}>
              Registrarse
            </Link>
          </div>
        </nav>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)', color: 'var(--accent-red)' }}
          >
            <Globe2 className="w-3 h-3" />
            🇺🇸 USA &nbsp;·&nbsp; 🇨🇦 CANADÁ &nbsp;·&nbsp; 🇲🇽 MÉXICO
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bebas gradient-text-white leading-none mb-1"
            style={{ fontSize: 'clamp(5rem,14vw,14rem)' }}
          >
            POLLA
          </motion.h1>
          <motion.h2 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="font-bebas leading-none mb-6"
            style={{ fontSize: 'clamp(3rem,9vw,9rem)', color: 'var(--accent-red)' }}
          >
            MUNDIAL
          </motion.h2>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="h-px flex-1 max-w-24" style={{ background: 'var(--border-subtle)' }} />
            <span className="font-oswald text-sm tracking-[0.3em] uppercase" style={{ color: 'var(--text-secondary)' }}>
              COPA MUNDIAL FIFA <span style={{ color: 'var(--accent-red)' }}>2026</span>
            </span>
            <div className="h-px flex-1 max-w-24" style={{ background: 'var(--border-subtle)' }} />
          </motion.div>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-10 mb-10">
            <p className="font-oswald text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              El torneo comienza en
            </p>
            <div className="inline-flex items-center gap-3 md:gap-6">
              {[{ val: cd.days, label: 'días' }, { val: cd.hours, label: 'horas' }, { val: cd.minutes, label: 'min' }, { val: cd.seconds, label: 'seg' }].map(({ val, label }, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="glass glow-red-sm rounded-xl px-3 md:px-5 py-2 md:py-3 min-w-[60px] md:min-w-[80px] text-center">
                    <span className="font-bebas text-white leading-none" style={{ fontSize: 'clamp(1.8rem,4vw,3.5rem)' }}>
                      {String(val).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/registro"
              className="group relative px-8 py-4 rounded-xl font-semibold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ background: 'var(--accent-red)', boxShadow: '0 0 30px rgba(230,57,70,0.4)' }}
            >
              Unirme ahora
            </Link>
            <Link href="/login"
              className="px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              Ya tengo cuenta
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float"
        >
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>scroll</span>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────── */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center"
        >
          {[{ v: 104, l: 'Partidos' }, { v: 48, l: 'Selecciones' }, { v: 32, l: 'Días' }].map(({ v, l }) => (
            <motion.div key={l} variants={fadeUp}>
              <div className="font-bebas text-6xl md:text-8xl gradient-text-red leading-none"><AnimatedNumber value={v} /></div>
              <div className="mt-1 font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CÓMO JUGAR ───────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <p className="font-oswald text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent-red)' }}>— Cómo funciona —</p>
          <h2 className="font-bebas text-6xl md:text-8xl gradient-text-white">CÓMO JUGAR</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
          {[
            { num: '01', Icon: Target, title: 'PRONÓSTICA', desc: 'Ingresa el marcador exacto de cada partido. Puedes modificar hasta 1 hora antes del pitazo inicial.' },
            { num: '02', Icon: BarChart3, title: 'ACUMULA', desc: 'Gana puntos por cada acierto. Resultado exacto = 3 pts. Ganador correcto = 1 pt.' },
            { num: '03', Icon: Trophy, title: 'GANA', desc: 'Los 3 primeros del ranking se reparten el pozo: 60% · 25% · 15%.', h: true },
          ].map(({ num, Icon, title, desc, h }) => (
            <motion.div key={num} variants={fadeUp}
              className="relative rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: h ? 'linear-gradient(135deg,rgba(230,57,70,0.1),rgba(230,57,70,0.04))' : 'var(--bg-card)',
                border: h ? '1px solid rgba(230,57,70,0.4)' : '1px solid var(--border-subtle)',
                boxShadow: h ? '0 0 30px rgba(230,57,70,0.15)' : undefined,
              }}
            >
              <div className="absolute top-4 right-6 font-bebas text-8xl leading-none select-none"
                style={{ color: h ? 'rgba(230,57,70,0.1)' : 'rgba(255,255,255,0.04)' }}>{num}</div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: h ? 'rgba(230,57,70,0.2)' : 'rgba(255,255,255,0.06)' }}>
                <Icon className="w-6 h-6" style={{ color: h ? 'var(--accent-red)' : 'var(--text-secondary)' }} />
              </div>
              <h3 className="font-oswald text-2xl font-bold mb-3 tracking-wide" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────── */}
      <section style={{ background: 'var(--bg-secondary)' }} className="py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-24">
          {[
            { Icon: Zap, tag: 'Tiempo Real', title: 'TABLA EN\nTIEMPO REAL', desc: 'La clasificación se actualiza automáticamente cada vez que se carga un resultado. Sin recargar la página.', stat: '104', statL: 'partidos', flip: false },
            { Icon: Shield, tag: 'Admin Panel', title: 'GESTIÓN\nCOMPLETA', desc: 'Carga de resultados, gestión de pagos, configuración del sistema de puntos. Todo en un panel intuitivo.', stat: '100%', statL: 'configurable', flip: true },
            { Icon: BarChart3, tag: 'Estadísticas', title: 'ESTADÍSTICAS\nPROFUNDAS', desc: 'Evolución de puntos, análisis de rendimiento, comparativas entre participantes. Todos los datos.', stat: '+10', statL: 'métricas', flip: false },
          ].map(({ Icon, tag, title, desc, stat, statL, flip }) => (
            <motion.div key={title} initial={{ opacity: 0, x: flip ? 60 : -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={`flex flex-col md:flex-row items-center gap-12 ${flip ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--accent-red)' }}>
                  <Icon className="w-3 h-3" />{tag}
                </div>
                <h3 className="font-bebas text-5xl md:text-6xl gradient-text-white mb-4 whitespace-pre-line">{title}</h3>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                <div className="flex items-end gap-2">
                  <span className="font-bebas text-5xl gradient-text-red">{stat}</span>
                  <span className="pb-2 text-sm" style={{ color: 'var(--text-muted)' }}>{statL}</span>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-xs aspect-square rounded-3xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,var(--bg-card),var(--bg-elevated))', border: '1px solid var(--border-subtle)' }}>
                  <Icon className="w-20 h-20 opacity-15" style={{ color: 'var(--accent-red)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PUNTOS ───────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-bebas text-6xl gradient-text-white mb-2">SISTEMA DE PUNTOS</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Simple de entender, difícil de dominar</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-4">
          {[
            { pts: '3', l: 'Resultado exacto', s: 'Marcador perfecto' },
            { pts: '1', l: 'Ganador / Empate', s: 'Tendencia correcta' },
            { pts: '+1', l: 'Bonus eliminatoria', s: 'Exacto en playoff' },
            { pts: '15', l: 'Campeón mundial', s: 'Pronóstico especial' },
            { pts: '5', l: 'Cada semifinalista', s: 'Pronóstico especial' },
            { pts: '0', l: 'Incorrecto', s: 'Sin puntos' },
          ].map(({ pts, l, s }) => (
            <motion.div key={l} variants={fadeUp}
              className="flex items-center gap-5 p-5 rounded-2xl transition-all hover:scale-[1.01]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bebas text-2xl flex-shrink-0"
                style={{ background: pts === '0' ? 'rgba(255,255,255,0.04)' : 'rgba(230,57,70,0.12)', color: pts === '0' ? 'var(--text-muted)' : 'var(--accent-red)' }}>
                {pts}
              </div>
              <div>
                <div className="font-oswald font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{l}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section style={{ background: 'var(--bg-secondary)' }} className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-bebas text-6xl gradient-text-white text-center mb-12">
            PREGUNTAS FRECUENTES
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left transition-all"
                  style={{ background: openFaq === i ? 'linear-gradient(90deg,rgba(230,57,70,0.08),rgba(230,57,70,0.02))' : 'var(--bg-card)' }}
                >
                  <span className="font-oswald text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-300"
                    style={{ color: 'var(--accent-red)', transform: openFaq === i ? 'rotate(180deg)' : undefined }} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(230,57,70,0.15),transparent)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Trophy className="w-16 h-16 mx-auto mb-6 animate-float" style={{ color: 'var(--accent-gold)' }} />
            <h2 className="font-bebas text-7xl md:text-9xl gradient-text-white mb-4">¿LISTO?</h2>
            <p className="text-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
              Únete al mejor torneo de pronósticos del Mundial 2026
            </p>
            <Link href="/registro"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl text-white transition-all hover:scale-105"
              style={{ background: 'var(--accent-red)', boxShadow: '0 0 50px rgba(230,57,70,0.4)' }}
            >
              Registrarse gratis <ChevronRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer style={{ background: '#070709', borderTop: '1px solid var(--border-subtle)' }} className="py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
            <span className="font-bebas text-xl tracking-widest text-white">POLLA MUNDIAL 2026</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>Login</Link>
            <Link href="/registro" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>Registro</Link>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hecho con ❤️ para el Mundial 2026</p>
        </div>
      </footer>
    </div>
  )
}
