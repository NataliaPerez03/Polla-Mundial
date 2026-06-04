import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPointsConfig } from '@/lib/points'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = await getPointsConfig()
  return NextResponse.json(config)
}

export async function PUT(request: Request) {
  return PATCH(request)
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const config = await prisma.pointsConfig.findFirst()

  const updated = config
    ? await prisma.pointsConfig.update({ where: { id: config.id }, data: body })
    : await prisma.pointsConfig.create({ data: body })

  return NextResponse.json(updated)
}
