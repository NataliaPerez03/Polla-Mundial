'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Menu, X } from 'lucide-react'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Puntuación', href: '#puntuacion' },
  { label: 'FAQ', href: '#faq' },
]

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('#inicio')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: 'rgba(230,57,70,0.2)', border: '1px solid rgba(230,57,70,0.4)' }}>
              <Trophy className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
            </div>
            <span className="font-bebas text-xl tracking-widest text-white hidden sm:block">
              POLLA MUNDIAL
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:text-white hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="hidden sm:flex px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{ border: '1px solid var(--accent-red)', color: 'var(--accent-red)' }}>
              Iniciar sesión
            </Link>
            {/* Hamburger */}
            <button onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg transition-all hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{ background: 'rgba(10,10,15,0.97)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-5 py-4 space-y-1">
              {links.map(l => (
                <button key={l.href}
                  onClick={() => { scrollTo(l.href); setOpen(false) }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }}>
                  {l.label}
                </button>
              ))}
              <Link href="/login" onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-center mt-2"
                style={{ background: 'var(--accent-red)', color: 'white' }}>
                Iniciar sesión
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
