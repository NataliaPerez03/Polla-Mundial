'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  Trophy, LayoutDashboard, Calendar, Star, BarChart3,
  DollarSign, Settings, LogOut, ChevronRight,
} from 'lucide-react'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/fixture', icon: Calendar, label: 'Fixture' },
  { href: '/mis-pronosticos', icon: Star, label: 'Mis pronósticos' },
  { href: '/tabla-posiciones', icon: Trophy, label: 'Tabla' },
  { href: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
  { href: '/pozo', icon: DollarSign, label: 'Pozo' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <aside
      className="hidden lg:flex flex-col w-[260px] min-h-screen fixed left-0 top-0 z-40 scrollbar-thin overflow-y-auto"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}
        >
          <Trophy className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
        </div>
        <div>
          <div className="font-bebas text-lg leading-none tracking-widest text-white">POLLA MUNDIAL</div>
          <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>FIFA 2026</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${active ? 'nav-active' : 'hover:bg-white/5'}`}
              >
                <Icon
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: active ? 'var(--accent-red)' : 'var(--text-muted)' }}
                />
                <span className="text-sm font-medium" style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {label}
                </span>
                {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: 'var(--accent-red)' }} />}
              </motion.div>
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-3">
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                Admin
              </span>
            </div>
            <Link href="/admin">
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${pathname.startsWith('/admin') ? 'nav-active' : 'hover:bg-white/5'}`}
              >
                <Settings
                  className="w-5 h-5"
                  style={{ color: pathname.startsWith('/admin') ? 'var(--accent-red)' : 'var(--text-muted)' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: pathname.startsWith('/admin') ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  Panel Admin
                </span>
              </motion.div>
            </Link>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'rgba(230,57,70,0.2)', color: 'var(--accent-red)' }}
          >
            {session?.user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {session?.user?.name ?? 'Usuario'}
            </div>
            <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {session?.user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
