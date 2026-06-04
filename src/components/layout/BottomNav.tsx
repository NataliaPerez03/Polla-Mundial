'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Star, Trophy, BarChart3 } from 'lucide-react'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { href: '/fixture', icon: Calendar, label: 'Fixture' },
  { href: '/mis-pronosticos', icon: Star, label: 'Pronósticos' },
  { href: '/tabla-posiciones', icon: Trophy, label: 'Tabla' },
  { href: '/estadisticas', icon: BarChart3, label: 'Stats' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-safe"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '8px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      {nav.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-w-[56px]"
            style={{ color: active ? 'var(--accent-red)' : 'var(--text-muted)' }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
            {active && (
              <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: 'var(--accent-red)' }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
