import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { recalculateAllPoints } from '@/lib/points'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { homeScore, awayScore, status } = body

  const match = await prisma.match.update({
    where: { id },
    data: {
      homeScore: homeScore !== undefined ? parseInt(homeScore) : undefined,
      awayScore: awayScore !== undefined ? parseInt(awayScore) : undefined,
      status: status || undefined,
    },
  })

  if (homeScore !== undefined && awayScore !== undefined) {
    await recalculateAllPoints(id)
  }

  return NextResponse.json(match)
}
