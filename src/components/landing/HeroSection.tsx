'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

function useCountdown(target: Date) {
  const zero = { days: 0, hours: 0, mins: 0, secs: 0 }
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(zero) // start with zeros to match SSR
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  return { ...t, mounted }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-1" suppressHydrationWarning>
      <div className="relative overflow-hidden" suppressHydrationWarning>
        <motion.div
          key={str}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="font-bebas leading-none text-white"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            textShadow: '0 0 30px rgba(230,57,70,0.4)',
          }}
          suppressHydrationWarning
        >
          {str}
        </motion.div>
      </div>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <span className="font-bebas text-3xl md:text-5xl mb-4 select-none" style={{ color: 'rgba(230,57,70,0.5)' }}>
      :
    </span>
  )
}

// CSS-only animated particles
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 1 + (i % 3),
    left: `${(i * 5.2) % 100}%`,
    duration: 8 + (i % 10),
    delay: (i * 0.6) % 8,
    opacity: 0.15 + (i % 4) * 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: '-10px',
            background: 'var(--accent-red)',
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
      {/* Animated diagonal lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1={`${i * 14}%`} y1="0%"
            x2={`${i * 14 + 30}%`} y2="100%"
            stroke="white" strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  )
}

export function HeroSection() {
  const kickoff = new Date('2026-06-11T20:00:00-05:00')
  const { mounted, ...cd } = useCountdown(kickoff)

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg,#0a0a0f 0%,#14080d 35%,#1c0a10 65%,#0a0a0f 100%)' }} />

      {/* Stadium image with overlay */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&q=60"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.08 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.5) 0%, rgba(10,10,15,0.9) 100%)' }} />
      </div>

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,214,10,0.04) 0%, transparent 70%)' }} />
      </div>

      <Particles />

      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-6xl mx-auto pt-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-4 mb-8"
        >
          <div className="h-px w-12 md:w-20 bg-gray-600" />
          <span className="text-xs uppercase tracking-widest text-gray-400 whitespace-nowrap">
            Torneo de Pronósticos 2026
          </span>
          <div className="h-px w-12 md:w-20 bg-gray-600" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-bebas leading-none mb-2 tracking-widest"
          style={{
            fontSize: 'clamp(5rem, 15vw, 15rem)',
            background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          POLLA MUNDIAL
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 mb-3"
        >
          <div className="h-px w-16 md:w-32" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <p className="font-bebas tracking-[0.4em] text-xl md:text-2xl" style={{ color: 'var(--text-secondary)' }}>
            COPA MUNDIAL DE LA FIFA{' '}
            <span style={{ color: 'var(--accent-red)' }}>2026</span>
          </p>
          <div className="h-px w-16 md:w-32" style={{ background: 'rgba(255,255,255,0.12)' }} />
        </motion.div>

        {/* Countries */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base md:text-lg mb-12"
          style={{ color: 'var(--text-muted)' }}
        >
          🇺🇸 USA &nbsp;&nbsp;•&nbsp;&nbsp; 🇨🇦 CANADÁ &nbsp;&nbsp;•&nbsp;&nbsp; 🇲🇽 MÉXICO
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <p className="font-bebas text-xs tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
            El torneo inicia en
          </p>
          <div className="flex items-end gap-3 md:gap-5 justify-center" suppressHydrationWarning>
            {/* Countdown blocks */}
            <div className="glass rounded-2xl px-4 md:px-8 py-3 md:py-5 text-center min-w-[70px] md:min-w-[100px]"
              style={{ boxShadow: '0 0 20px rgba(230,57,70,0.15)' }}>
              <CountdownUnit value={cd.days} label="Días" />
            </div>
            <Separator />
            <div className="glass rounded-2xl px-4 md:px-8 py-3 md:py-5 text-center min-w-[70px] md:min-w-[100px]"
              style={{ boxShadow: '0 0 20px rgba(230,57,70,0.15)' }}>
              <CountdownUnit value={cd.hours} label="Horas" />
            </div>
            <Separator />
            <div className="glass rounded-2xl px-4 md:px-8 py-3 md:py-5 text-center min-w-[70px] md:min-w-[100px]"
              style={{ boxShadow: '0 0 20px rgba(230,57,70,0.15)' }}>
              <CountdownUnit value={cd.mins} label="Minutos" />
            </div>
            <Separator />
            <div className="glass rounded-2xl px-4 md:px-8 py-3 md:py-5 text-center min-w-[70px] md:min-w-[100px]"
              style={{ boxShadow: '0 0 20px rgba(230,57,70,0.15)' }}>
              <CountdownUnit value={cd.secs} label="Segundos" />
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-20"
        >
          <Link href="/login"
            className="group relative px-8 py-4 rounded-2xl font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent-red)', boxShadow: '0 0 40px rgba(230,57,70,0.45)' }}
          >
            <span className="relative z-10">INGRESAR A LA POLLA</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg,#ff4a57,#e63946)' }} />
          </Link>

          <button
            onClick={() => {
              const el = document.querySelector('#como-funciona')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
          >
            CÓMO FUNCIONA
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => {
          const el = document.querySelector('#que-es')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
      >

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
