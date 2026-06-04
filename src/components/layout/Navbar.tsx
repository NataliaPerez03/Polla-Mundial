'use client'

import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/fixture': 'Fixture',
  '/mis-pronosticos': 'Mis Pronósticos',
  '/tabla-posiciones': 'Tabla de Posiciones',
  '/estadisticas': 'Estadísticas',
  '/pozo': 'El Pozo',
  '/admin': 'Panel Admin',
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? ''

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <h1 className="font-oswald text-xl font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h1>
      <div className="flex items-center gap-3">
        {session?.user?.role === 'ADMIN' && (
          <Link href="/admin"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', color: 'var(--accent-red)' }}
          >
            <Settings className="w-3 h-3" />
            Admin
          </Link>
        )}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(230,57,70,0.2)', color: 'var(--accent-red)' }}
          >
            {session?.user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {session?.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="p-2 rounded-lg transition-all hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
