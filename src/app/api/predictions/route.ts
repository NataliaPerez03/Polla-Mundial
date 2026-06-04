import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { isMatchLocked } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const predictions = await prisma.prediction.findMany({
    where: { userId: session.user.id },
    include: { match: true },
    orderBy: { match: { scheduledAt: 'asc' } },
  })

  return NextResponse.json(predictions)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { matchId, homeScore, awayScore } = body

  if (homeScore === undefined || awayScore === undefined || !matchId) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  const match = await prisma.match.findUnique({ where: { id: matchId } })
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  if (isMatchLocked(match.scheduledAt)) {
    return NextResponse.json({ error: 'Pronóstico bloqueado: el partido empieza en menos de 1 hora' }, { status: 400 })
  }

  const prediction = await prisma.prediction.upsert({
    where: { userId_matchId: { userId: session.user.id, matchId } },
    update: { homeScore: parseInt(homeScore), awayScore: parseInt(awayScore) },
    create: {
      userId: session.user.id,
      matchId,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
    },
  })

  return NextResponse.json(prediction)
}
