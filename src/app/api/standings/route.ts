import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, paid: true,
      totalPoints: true, exactPredictions: true, correctPredictions: true,
    },
    orderBy: { totalPoints: 'desc' },
  })

  return NextResponse.json(users)
}
