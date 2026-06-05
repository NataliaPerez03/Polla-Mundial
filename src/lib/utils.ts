import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistance, isPast, addHours } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es })
}

export function formatDateShort(date: Date | string) {
  return format(new Date(date), "dd/MM HH:mm", { locale: es })
}

export function timeAgo(date: Date | string) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: es })
}

export function isMatchLocked(scheduledAt: Date | string): boolean {
  const matchTime = new Date(scheduledAt)
  const lockTime = addHours(matchTime, -1)
  return isPast(lockTime)
}

export function getPhaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    GROUPS: 'Fase de Grupos',
    ROUND_OF_32: 'Treintaidosavos',
    ROUND_OF_16: 'Octavos de Final',
    QUARTERFINALS: 'Cuartos de Final',
    SEMIFINALS: 'Semifinales',
    THIRD_PLACE: 'Tercer Puesto',
    FINAL: 'Final',
  }
  return labels[phase] ?? phase
}

export function getMatchResult(homeScore: number, awayScore: number): 'home' | 'away' | 'draw' {
  if (homeScore > awayScore) return 'home'
  if (awayScore > homeScore) return 'away'
  return 'draw'
}

// Map from FIFA 3-letter codes to ISO 2-letter codes for flagcdn.com
const FIFA_TO_ISO: Record<string, string> = {
  ARG: 'ar', BRA: 'br', COL: 'co', ECU: 'ec', URU: 'uy', VEN: 've',
  GER: 'de', ESP: 'es', FRA: 'fr', ENG: 'gb-eng', POR: 'pt', NED: 'nl',
  BEL: 'be', AUT: 'at', SUI: 'ch', TUR: 'tr', SCO: 'gb-sct', HUN: 'hu',
  SVN: 'si', SVK: 'sk', GEO: 'ge', DEN: 'dk',
  USA: 'us', MEX: 'mx', CAN: 'ca', HON: 'hn', CRC: 'cr', PAN: 'pa',
  MAR: 'ma', EGY: 'eg', NGA: 'ng', RSA: 'za', SEN: 'sn', CIV: 'ci',
  COD: 'cd', GHA: 'gh', CMR: 'cm',
  JPN: 'jp', KOR: 'kr', KSA: 'sa', AUS: 'au', IRN: 'ir', UZB: 'uz',
  QAT: 'qa', JOR: 'jo', NZL: 'nz',
}

export function getFlagUrl(code: string): string {
  const iso = FIFA_TO_ISO[code.toUpperCase()] ?? code.toLowerCase()
  return `https://flagcdn.com/24x18/${iso}.png`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount)
}
