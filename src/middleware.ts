import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // Exclude landing page (/), static files, and public assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|$).*)'],
}
