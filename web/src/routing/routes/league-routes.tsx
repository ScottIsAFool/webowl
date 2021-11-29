import * as React from 'react'
import type { RouteObject } from 'react-router-dom'
import { Leagues } from '../../pages/leagues'
import { GuardedRoute } from '../guarded-route'

type LeagueRoute = 'leagues' | ''

function ar(route: LeagueRoute): string {
    return route
}

export function leagueNavigate(route: LeagueRoute): string {
    return `/leagues/${route}`
}

function leagueRoutes(isAuthenticated: boolean): RouteObject[] {
    return [
        {
            path: ar('leagues'),
            element: <GuardedRoute target={<Leagues />} isAuthenticated={isAuthenticated} />,
        },
    ]
}

export { leagueRoutes }
