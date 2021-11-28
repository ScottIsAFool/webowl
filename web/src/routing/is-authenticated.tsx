import * as React from 'react'
import { Navigate } from 'react-router-dom'
import type { GuardedRouteProps } from './types'

function IsAuthenticated({ isAuthenticated, target }: GuardedRouteProps): JSX.Element | null {
    return isAuthenticated ? <Navigate to="/leagues" replace={true} /> : target
}

export { IsAuthenticated }
