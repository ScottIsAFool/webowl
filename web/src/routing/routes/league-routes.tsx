import * as React from 'react'

import { League, Leagues } from '../../pages/leagues'
import { AcceptInvite } from '../../pages/leagues/accept-invite'
import { GuardedRoute } from '../guarded-route'

import type { RouteObject } from 'react-router-dom'

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
                    path: 'accept-invite',
                    element: (
                        <GuardedRoute target={<AcceptInvite />} isAuthenticated={isAuthenticated} />
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
