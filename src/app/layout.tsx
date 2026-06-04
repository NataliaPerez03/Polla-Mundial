import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/Providers'

export const metadata: Metadata = {
  title: 'Polla Mundial 2026',
  description: 'El mejor sistema de pronósticos para el Mundial FIFA 2026 — USA · Canadá · México',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-bebas: 'Bebas Neue', sans-serif;
            --font-oswald: 'Oswald', sans-serif;
            --font-dm-sans: 'DM Sans', sans-serif;
            --font-jetbrains: 'JetBrains Mono', monospace;
          }
        `}</style>
      </head>
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
