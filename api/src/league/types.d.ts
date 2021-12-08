import type { Request } from 'express'
import type { League } from './league.entity'

export type RequestWithLeague = Request & {
    league: League
}
