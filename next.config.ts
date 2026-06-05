import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-libsql', '@libsql/client'],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
