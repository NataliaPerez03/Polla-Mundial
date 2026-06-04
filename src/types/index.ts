import type { User, Match, Prediction, SpecialPrediction } from '@prisma/client'

export type { User, Match, Prediction, SpecialPrediction }

export type UserRole = 'ADMIN' | 'PARTICIPANT'
export type MatchPhase = 'GROUPS' | 'ROUND_OF_32' | 'ROUND_OF_16' | 'QUARTERFINALS' | 'SEMIFINALS' | 'THIRD_PLACE' | 'FINAL'
export type MatchStatusType = 'SCHEDULED' | 'LIVE' | 'FINISHED'

export interface UserWithPoints extends User {
  predictions: PredictionWithMatch[]
  specialPrediction: SpecialPrediction | null
}

export interface PredictionWithMatch extends Prediction {
  match: Match
}

export interface MatchWithPrediction extends Match {
  predictions: Prediction[]
  userPrediction?: Prediction | null
}

export interface StandingsRow {
  id: string
  name: string
  email: string
  totalPoints: number
  exactPredictions: number
  correctPredictions: number
  paid: boolean
}
