import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const teams = [
  // CONMEBOL
  { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
  { name: 'Brasil', flag: '🇧🇷', code: 'BRA' },
  { name: 'Colombia', flag: '🇨🇴', code: 'COL' },
  { name: 'Ecuador', flag: '🇪🇨', code: 'ECU' },
  { name: 'Uruguay', flag: '🇺🇾', code: 'URU' },
  { name: 'Venezuela', flag: '🇻🇪', code: 'VEN' },
  // UEFA
  { name: 'Alemania', flag: '🇩🇪', code: 'GER' },
  { name: 'España', flag: '🇪🇸', code: 'ESP' },
  { name: 'Francia', flag: '🇫🇷', code: 'FRA' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
  { name: 'Portugal', flag: '🇵🇹', code: 'POR' },
  { name: 'Países Bajos', flag: '🇳🇱', code: 'NED' },
  { name: 'Bélgica', flag: '🇧🇪', code: 'BEL' },
  { name: 'Austria', flag: '🇦🇹', code: 'AUT' },
  { name: 'Suiza', flag: '🇨🇭', code: 'SUI' },
  { name: 'Turquía', flag: '🇹🇷', code: 'TUR' },
  { name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', code: 'SCO' },
  { name: 'Hungría', flag: '🇭🇺', code: 'HUN' },
  { name: 'Eslovenia', flag: '🇸🇮', code: 'SVN' },
  { name: 'Eslovaquia', flag: '🇸🇰', code: 'SVK' },
  { name: 'Georgia', flag: '🇬🇪', code: 'GEO' },
  { name: 'Dinamarca', flag: '🇩🇰', code: 'DEN' },
  // CONCACAF
  { name: 'EE.UU.', flag: '🇺🇸', code: 'USA' },
  { name: 'México', flag: '🇲🇽', code: 'MEX' },
  { name: 'Canadá', flag: '🇨🇦', code: 'CAN' },
  { name: 'Honduras', flag: '🇭🇳', code: 'HON' },
  { name: 'Costa Rica', flag: '🇨🇷', code: 'CRC' },
  { name: 'Panamá', flag: '🇵🇦', code: 'PAN' },
  // CAF
  { name: 'Marruecos', flag: '🇲🇦', code: 'MAR' },
  { name: 'Egipto', flag: '🇪🇬', code: 'EGY' },
  { name: 'Nigeria', flag: '🇳🇬', code: 'NGA' },
  { name: 'Sudáfrica', flag: '🇿🇦', code: 'RSA' },
  { name: 'Senegal', flag: '🇸🇳', code: 'SEN' },
  { name: 'Costa de Marfil', flag: '🇨🇮', code: 'CIV' },
  { name: 'RD Congo', flag: '🇨🇩', code: 'COD' },
  { name: 'Ghana', flag: '🇬🇭', code: 'GHA' },
  { name: 'Camerún', flag: '🇨🇲', code: 'CMR' },
  // AFC
  { name: 'Japón', flag: '🇯🇵', code: 'JPN' },
  { name: 'Corea del Sur', flag: '🇰🇷', code: 'KOR' },
  { name: 'Arabia Saudita', flag: '🇸🇦', code: 'KSA' },
  { name: 'Australia', flag: '🇦🇺', code: 'AUS' },
  { name: 'Irán', flag: '🇮🇷', code: 'IRN' },
  { name: 'Uzbekistán', flag: '🇺🇿', code: 'UZB' },
  { name: 'Qatar', flag: '🇶🇦', code: 'QAT' },
  { name: 'Jordania', flag: '🇯🇴', code: 'JOR' },
  // OFC
  { name: 'Nueva Zelanda', flag: '🇳🇿', code: 'NZL' },
  // Repechajes
  { name: 'Interconf. 1', flag: '🌍', code: 'IC1' },
  { name: 'Interconf. 2', flag: '🌍', code: 'IC2' },
]

function t(code: string) {
  return teams.find(t => t.code === code)!
}

const groups: Record<string, string[]> = {
  A: ['MEX', 'ARG', 'ECU', 'CMR'],
  B: ['USA', 'URU', 'BEL', 'MAR'],
  C: ['CAN', 'FRA', 'GER', 'SEN'],
  D: ['ESP', 'BRA', 'POR', 'JPN'],
  E: ['ENG', 'COL', 'AUS', 'NGA'],
  F: ['NED', 'KOR', 'PAN', 'RDC' in teams ? 'COD' : 'COD'],
  G: ['TUR', 'VEN', 'SUI', 'QAT'],
  H: ['GEO', 'HON', 'DEN', 'EGY'],
  I: ['AUT', 'KSA', 'CRC', 'GHA'],
  J: ['SVK', 'IRN', 'RSA', 'JOR'],
  K: ['HUN', 'SVN', 'SCO', 'UZB'],
  L: ['NZL', 'CIV', 'IC1', 'IC2'],
}

const venues: Record<string, { venue: string; city: string }> = {
  A: { venue: 'Estadio Azteca', city: 'Ciudad de México' },
  B: { venue: 'SoFi Stadium', city: 'Los Ángeles' },
  C: { venue: 'BC Place', city: 'Vancouver' },
  D: { venue: 'Rose Bowl', city: 'Los Ángeles' },
  E: { venue: 'AT&T Stadium', city: 'Dallas' },
  F: { venue: 'Levi\'s Stadium', city: 'San Francisco' },
  G: { venue: 'Lincoln Financial Field', city: 'Filadelfia' },
  H: { venue: 'Estadio BBVA', city: 'Monterrey' },
  I: { venue: 'NRG Stadium', city: 'Houston' },
  J: { venue: 'Estadio Akron', city: 'Guadalajara' },
  K: { venue: 'MetLife Stadium', city: 'Nueva York' },
  L: { venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
}

async function main() {
  console.log('🌍 Iniciando seed del Mundial 2026...')

  await prisma.pointsConfig.deleteMany()
  await prisma.specialPrediction.deleteMany()
  await prisma.prediction.deleteMany()
  await prisma.match.deleteMany()
  await prisma.user.deleteMany()

  // Config
  await prisma.pointsConfig.create({
    data: { id: 'config', exactScore: 3, correctResult: 1, champion: 15, semifinalist: 5, bonusKnockout: 1, prizeFirst: 60, prizeSecond: 25, prizeThird: 15, entryFee: 50000 },
  })
  console.log('✅ Configuración creada')

  // Users
  const hash = await bcrypt.hash('Admin2026!', 10)
  const playerHash = await bcrypt.hash('Mundial2026!', 10)

  await prisma.user.create({
    data: { name: 'Administrador', email: 'admin@mundial2026.com', password: hash, role: 'ADMIN', paid: true },
  })

  const playerNames = [
    { name: 'Carlos Rodríguez', email: 'carlos@mundial2026.com' },
    { name: 'Valentina Gómez', email: 'valentina@mundial2026.com' },
    { name: 'Sebastián Torres', email: 'sebastian@mundial2026.com' },
    { name: 'Camila Martínez', email: 'camila@mundial2026.com' },
    { name: 'Andrés Pérez', email: 'andres@mundial2026.com' },
    { name: 'Daniela López', email: 'daniela@mundial2026.com' },
    { name: 'Felipe Vargas', email: 'felipe@mundial2026.com' },
    { name: 'Isabella Moreno', email: 'isabella@mundial2026.com' },
  ]
  const players = await Promise.all(
    playerNames.map((p, i) => prisma.user.create({
      data: { ...p, password: playerHash, paid: i < 6 },
    }))
  )
  console.log(`✅ ${players.length + 1} usuarios creados`)

  // ── GROUP STAGE ───────────────────────────────────────────────────────────
  let matchNum = 1
  const matchIds: string[] = []

  // Each group: 3 rounds, 2 matches per round, 6 matches total
  const matchDates: Record<string, string[]> = {
    A: ['2026-06-11', '2026-06-15', '2026-06-19'],
    B: ['2026-06-11', '2026-06-15', '2026-06-19'],
    C: ['2026-06-12', '2026-06-16', '2026-06-20'],
    D: ['2026-06-12', '2026-06-16', '2026-06-20'],
    E: ['2026-06-13', '2026-06-17', '2026-06-21'],
    F: ['2026-06-13', '2026-06-17', '2026-06-21'],
    G: ['2026-06-14', '2026-06-18', '2026-06-22'],
    H: ['2026-06-14', '2026-06-18', '2026-06-22'],
    I: ['2026-06-15', '2026-06-19', '2026-06-23'],
    J: ['2026-06-15', '2026-06-19', '2026-06-23'],
    K: ['2026-06-16', '2026-06-20', '2026-06-24'],
    L: ['2026-06-16', '2026-06-20', '2026-06-24'],
  }

  const times = ['14:00', '17:00', '20:00']

  for (const [grp, codes] of Object.entries(groups)) {
    const [t1, t2, t3, t4] = codes.map(c => t(c))
    const dates = matchDates[grp]
    const ven = venues[grp]
    const matchups = [
      [t1, t2], [t3, t4],   // Round 1
      [t1, t3], [t2, t4],   // Round 2
      [t1, t4], [t2, t3],   // Round 3
    ]
    for (let i = 0; i < matchups.length; i++) {
      const [home, away] = matchups[i]
      const round = Math.floor(i / 2)
      const dateStr = `${dates[round]}T${times[i % 2]}:00`
      const m = await prisma.match.create({
        data: {
          matchNumber: matchNum++,
          homeTeam: home.name, awayTeam: away.name,
          homeFlag: home.flag, awayFlag: away.flag,
          homeCode: home.code, awayCode: away.code,
          phase: 'GROUPS', group: grp,
          venue: ven.venue, city: ven.city,
          scheduledAt: new Date(dateStr),
          // Pre-load some results for early matches
          ...(round === 0 && grp <= 'C' ? {
            homeScore: Math.floor(Math.random() * 3),
            awayScore: Math.floor(Math.random() * 3),
            status: 'FINISHED',
          } : {}),
        },
      })
      matchIds.push(m.id)
    }
  }

  // ── KNOCKOUT STAGE ────────────────────────────────────────────────────────
  const koPhases: { phase: string; count: number; start: string; venue: string; city: string }[] = [
    { phase: 'ROUND_OF_32', count: 16, start: '2026-06-27', venue: 'MetLife Stadium', city: 'Nueva York' },
    { phase: 'ROUND_OF_16', count: 8, start: '2026-07-03', venue: 'SoFi Stadium', city: 'Los Ángeles' },
    { phase: 'QUARTERFINALS', count: 4, start: '2026-07-08', venue: 'AT&T Stadium', city: 'Dallas' },
    { phase: 'SEMIFINALS', count: 2, start: '2026-07-14', venue: 'Rose Bowl', city: 'Los Ángeles' },
    { phase: 'THIRD_PLACE', count: 1, start: '2026-07-18', venue: 'Estadio Azteca', city: 'Ciudad de México' },
    { phase: 'FINAL', count: 1, start: '2026-07-19', venue: 'MetLife Stadium', city: 'Nueva York' },
  ]

  for (const ko of koPhases) {
    for (let i = 0; i < ko.count; i++) {
      const dayOffset = Math.floor(i / 2)
      const d = new Date(ko.start)
      d.setDate(d.getDate() + dayOffset)
      const hour = i % 2 === 0 ? '17:00' : '20:00'
      await prisma.match.create({
        data: {
          matchNumber: matchNum++,
          homeTeam: `Clasificado ${i * 2 + 1}`, awayTeam: `Clasificado ${i * 2 + 2}`,
          homeFlag: '🏳️', awayFlag: '🏳️', homeCode: `T${i * 2 + 1}`, awayCode: `T${i * 2 + 2}`,
          phase: ko.phase, venue: ko.venue, city: ko.city,
          scheduledAt: new Date(`${d.toISOString().split('T')[0]}T${hour}:00`),
        },
      })
    }
  }

  console.log(`✅ ${matchNum - 1} partidos creados`)

  // ── PREDICTIONS FOR FINISHED MATCHES ─────────────────────────────────────
  const finishedMatches = await prisma.match.findMany({ where: { status: 'FINISHED' } })
  for (const player of players) {
    for (const match of finishedMatches) {
      const home = Math.floor(Math.random() * 3)
      const away = Math.floor(Math.random() * 3)
      const exactHome = match.homeScore === home
      const exactAway = match.awayScore === away
      const isExact = exactHome && exactAway
      const realResult = match.homeScore! > match.awayScore! ? 'H' : match.homeScore! < match.awayScore! ? 'A' : 'D'
      const predResult = home > away ? 'H' : home < away ? 'A' : 'D'
      const isCorrect = realResult === predResult
      const pts = isExact ? 3 : isCorrect ? 1 : 0
      await prisma.prediction.create({
        data: {
          userId: player.id, matchId: match.id,
          homeScore: home, awayScore: away,
          points: pts, isExact, isCorrect,
        },
      })
      if (pts > 0) {
        await prisma.user.update({
          where: { id: player.id },
          data: {
            totalPoints: { increment: pts },
            exactPredictions: isExact ? { increment: 1 } : undefined,
            correctPredictions: isCorrect ? { increment: 1 } : undefined,
          },
        })
      }
    }
  }
  console.log('✅ Pronósticos de ejemplo creados')

  // Special predictions
  const championTeams = ['Argentina', 'Francia', 'Brasil', 'España', 'Portugal', 'Alemania', 'Inglaterra', 'Colombia']
  for (let i = 0; i < players.length; i++) {
    await prisma.specialPrediction.create({
      data: {
        userId: players[i].id,
        champion: championTeams[i % championTeams.length],
        semi1: 'Argentina', semi2: 'Francia', semi3: 'Brasil', semi4: 'España',
      },
    })
  }

  console.log('\n🏆 Seed completado exitosamente!')
  console.log(`   Admin: admin@mundial2026.com / Admin2026!`)
  console.log(`   Jugadores: carlos@mundial2026.com ... / Mundial2026!`)
  console.log(`   Total partidos: ${matchNum - 1}`)
  console.log(`   Usuarios: ${players.length + 1}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
