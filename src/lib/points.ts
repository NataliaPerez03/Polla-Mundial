import { prisma } from './prisma'

export async function getPointsConfig() {
  let config = await prisma.pointsConfig.findFirst()
  if (!config) config = await prisma.pointsConfig.create({ data: {} })
  return config
}

export function calculateMatchPoints(
  prediction: { homeScore: number; awayScore: number },
  result: { homeScore: number; awayScore: number },
  config: { exactScore: number; correctResult: number; bonusKnockout: number },
  isKnockout = false
): { points: number; isExact: boolean; isCorrect: boolean } {
  const isExact =
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore

  if (isExact) {
    return { points: config.exactScore + (isKnockout ? config.bonusKnockout : 0), isExact: true, isCorrect: true }
  }

  const predResult = getResult(prediction.homeScore, prediction.awayScore)
  const realResult = getResult(result.homeScore, result.awayScore)
  const isCorrect = predResult === realResult

  return { points: isCorrect ? config.correctResult : 0, isExact: false, isCorrect }
}

function getResult(home: number, away: number): 'H' | 'A' | 'D' {
  if (home > away) return 'H'
  if (away > home) return 'A'
  return 'D'
}

export async function recalculateAllPoints(matchId: string) {
  const config = await getPointsConfig()
  const match = await prisma.match.findUnique({ where: { id: matchId }, include: { predictions: true } })

  if (!match || match.homeScore === null || match.awayScore === null) return

  const isKnockout = match.phase !== 'GROUPS'

  for (const pred of match.predictions) {
    const { points, isExact, isCorrect } = calculateMatchPoints(
      { homeScore: pred.homeScore, awayScore: pred.awayScore },
      { homeScore: match.homeScore!, awayScore: match.awayScore! },
      config,
      isKnockout
    )
    await prisma.prediction.update({
      where: { id: pred.id },
      data: { points, isExact, isCorrect },
    })
  }

  const users = await prisma.user.findMany({ include: { predictions: true, specialPrediction: true } })
  for (const user of users) {
    const matchPoints = user.predictions.reduce((s, p) => s + p.points, 0)
    const specialPoints = (user.specialPrediction?.championPoints ?? 0) + (user.specialPrediction?.semiPoints ?? 0)
    const exactCount = user.predictions.filter(p => p.isExact).length
    const correctCount = user.predictions.filter(p => p.isCorrect).length
    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints: matchPoints + specialPoints, exactPredictions: exactCount, correctPredictions: correctCount },
    })
  }
}
