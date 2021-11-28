import * as React from 'react'
import type { RouteObject } from 'react-router-dom'
import { Leagues } from '../../pages/leagues'
import { GuardedRoute } from '../guarded-route'

function leagueRoutes(isAuthenticated: boolean): RouteObject[] {
    return [
        {
            path: 'leagues',
            element: <GuardedRoute target={<Leagues />} isAuthenticated={isAuthenticated} />,
        },
    ]
}

export { leagueRoutes }
