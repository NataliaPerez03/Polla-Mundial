import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const special = await prisma.specialPrediction.findUnique({ where: { userId: session.user.id } })
  return NextResponse.json(special)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { champion, semi1, semi2, semi3, semi4 } = body

  const special = await prisma.specialPrediction.upsert({
    where: { userId: session.user.id },
    update: { champion, semi1, semi2, semi3, semi4 },
    create: { userId: session.user.id, champion, semi1, semi2, semi3, semi4 },
  })

  return NextResponse.json(special)
}
