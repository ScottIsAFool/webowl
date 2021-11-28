import type { RouteObject } from 'react-router-dom'
import { appRoutes } from './app-routes'
import { authRoutes } from './auth-routes'
import { leagueRoutes } from './league-routes'

export function routes(isAuthenticated: boolean): RouteObject[] {
    return authRoutes(isAuthenticated)
        .concat(leagueRoutes(isAuthenticated))
        .concat(appRoutes(isAuthenticated))
}
