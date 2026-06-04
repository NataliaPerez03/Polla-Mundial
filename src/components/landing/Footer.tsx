'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function Footer() {
  return (
    <footer style={{ background: '#070709', borderTop: '1px solid var(--border-subtle)' }}>
      {/* CTA band */}
      <div className="py-16 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.08) 0%, transparent 50%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(230,57,70,0.08), transparent)' }} />
        <div className="relative max-w-2xl mx-auto px-5">
          <Trophy className="w-12 h-12 mx-auto mb-5" style={{ color: 'var(--accent-gold)' }} />
          <h3
            className="font-bebas leading-none mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              background: 'linear-gradient(135deg, #ffffff, #888888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ¿LISTO PARA JUGAR?
          </h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Ingresa a tu cuenta y empieza a pronosticar desde ya
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{ background: 'var(--accent-red)', boxShadow: '0 0 40px rgba(230,57,70,0.35)' }}
          >
            Ingresar a la Polla 🏆
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
            </div>
            <div>
              <div className="font-bebas text-lg tracking-widest text-white leading-none">POLLA MUNDIAL</div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>FIFA World Cup 2026</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
              Login
            </Link>
            <button
              onClick={() => scrollTo('#como-funciona')}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollTo('#puntuacion')}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              Puntuación
            </button>
            <button
              onClick={() => scrollTo('#faq')}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              FAQ
            </button>
          </div>

          {/* Tagline */}
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Hecho con ❤️ para el Mundial 2026
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 Polla Mundial — Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
