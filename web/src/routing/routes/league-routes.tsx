import * as React from 'react'
import type { RouteObject } from 'react-router-dom'
import { League, Leagues } from '../../pages/leagues'
import { GuardedRoute } from '../guarded-route'

type LeagueRoute = '' | ':id'

function ar(route: LeagueRoute): string {
    return route
}

export function leagueNavigate(route: LeagueRoute): string {
    return `/leagues/${route}`
}

function leagueRoutes(isAuthenticated: boolean): RouteObject[] {
    return [
        {
            path: 'leagues/',
            children: [
                {
                    index: true,
                    element: (
                        <GuardedRoute target={<Leagues />} isAuthenticated={isAuthenticated} />
                    ),
                },
                {
                    path: ar(':id'),
                    element: <GuardedRoute target={<League />} isAuthenticated={isAuthenticated} />,
                },
            ],
        },
    ]
}

export { leagueRoutes }
