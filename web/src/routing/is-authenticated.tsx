import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserManagement } from '../hooks'
import { leagueNavigate } from './routes/league-routes'
import type { GuardedRouteProps } from './types'

function IsHomeAuthenticated({ isAuthenticated, target }: GuardedRouteProps): JSX.Element | null {
    const { authenticatedUser } = useUserManagement()
    if (authenticatedUser?.defaultLeagueId) {
        return <Navigate to={`/leagues/${authenticatedUser.defaultLeagueId}`} replace={true} />
    }
    return IsAuthenticated({ isAuthenticated, target })
}

function IsAuthenticated({ isAuthenticated, target }: GuardedRouteProps): JSX.Element | null {
    return isAuthenticated ? <Navigate to={leagueNavigate('')} replace={true} /> : target
}

export { IsAuthenticated, IsHomeAuthenticated }
