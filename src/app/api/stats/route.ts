import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [me, allUsers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        predictions: {
          include: { match: { select: { homeScore: true, awayScore: true, scheduledAt: true } } },
          orderBy: { match: { scheduledAt: 'asc' } },
        },
      },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, totalPoints: true },
      orderBy: { totalPoints: 'desc' },
    }),
  ])

  if (!me) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const myFinished = me.predictions.filter(p => p.match.homeScore !== null)
  const total = myFinished.length
  const correct = myFinished.filter(p => p.isCorrect).length
  const exact = myFinished.filter(p => p.isExact).length

  // Cumulative points evolution
  let cum = 0
  const evolution = myFinished.map((p, i) => {
    cum += p.points
    return { label: `P${i + 1}`, points: p.points, cumPoints: cum }
  })

  // Best streak
  let bestStreak = 0, curStreak = 0
  for (const p of myFinished) {
    if (p.isCorrect) { curStreak++; bestStreak = Math.max(bestStreak, curStreak) }
    else curStreak = 0
  }

  const comparison = allUsers.map(u => ({ name: u.name.split(' ')[0], points: u.totalPoints }))

  return NextResponse.json({
    totalPredictions: total,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    exactRate: total > 0 ? Math.round((exact / total) * 100) : 0,
    bestStreak,
    evolution,
    comparison,
  })
}
