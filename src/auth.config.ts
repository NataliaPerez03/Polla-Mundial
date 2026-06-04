import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin = (auth?.user as { role?: string })?.role === 'ADMIN'
      const pathname = nextUrl.pathname

      const isLanding = pathname === '/'
      const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/registro')
      const isAdminPage = pathname.startsWith('/admin')
      const isApiAuthRoute = pathname.startsWith('/api/auth')

      // Public routes — always allow
      if (isApiAuthRoute || isLanding) return true

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl))
        return true
      }

      if (!isLoggedIn) return false

      if (isAdminPage && !isAdmin) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [],
}
