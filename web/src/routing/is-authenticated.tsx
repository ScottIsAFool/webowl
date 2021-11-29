import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { leagueNavigate } from './routes/league-routes'
import type { GuardedRouteProps } from './types'

function IsAuthenticated({ isAuthenticated, target }: GuardedRouteProps): JSX.Element | null {
    return isAuthenticated ? <Navigate to={leagueNavigate('')} replace={true} /> : target
}

export { IsAuthenticated }
