import * as React from 'react'
import { useRoutes } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Leagues } from '../../pages'
import { GuardedRoute } from '../guarded-route'
import { RouteResult } from '../types'

function LeagueRoutes(): RouteResult {
    const { isAuthenticated } = useAuth()
    const element = useRoutes([
        {
            path: '/leagues',
            element: <GuardedRoute target={<Leagues />} isAuthenticated={isAuthenticated} />,
        },
    ])

    return element
}

export { LeagueRoutes }
