import type { Request } from 'express'

export type RequestWithLeague = Request & {
    league: League
}