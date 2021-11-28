import type { RouteObject } from 'react-router-dom'
import { appRoutes } from './app-routes'
import { authRoutes } from './auth-routes'
import { leagueRoutes } from './league-routes'

export function routes(isAuthenticated: boolean): RouteObject[] {
    const routes = authRoutes(isAuthenticated).concat(leagueRoutes(isAuthenticated))

    return appRoutes(isAuthenticated, routes)
}
