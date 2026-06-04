import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPointsConfig } from '@/lib/points'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = await getPointsConfig()
  const users = await prisma.user.findMany({
    select: { id: true, name: true, paid: true, totalPoints: true },
    orderBy: { totalPoints: 'desc' },
  })

  const paidCount = users.filter(u => u.paid).length
  const totalPot = paidCount * config.entryFee

  return NextResponse.json({
    totalPot,
    entryFee: config.entryFee,
    paidCount,
    totalCount: users.length,
    prizeFirst: config.prizeFirst,
    prizeSecond: config.prizeSecond,
    prizeThird: config.prizeThird,
    users,
    config,
  })
}
