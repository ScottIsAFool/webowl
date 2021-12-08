import type { Fixture } from './fixture-types'

export type Round = {
    id: number
    date: Date
    seasonId: number
} & (
    | {
          isEmpty: true
          emptyReason?: string
      }
    | {
          isEmpty: false
          fixtures: Fixture[]
      }
)
