import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const phase = searchParams.get('phase')
  const group = searchParams.get('group')

  const matches = await prisma.match.findMany({
    where: {
      ...(phase ? { phase } : {}),
      ...(group ? { group } : {}),
    },
    include: {
      predictions: {
        where: { userId: session.user.id },
      },
    },
    orderBy: [{ scheduledAt: 'asc' }, { matchNumber: 'asc' }],
  })

  return NextResponse.json(matches)
}
