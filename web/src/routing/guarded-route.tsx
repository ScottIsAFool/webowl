import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { authNavigate } from './routes/auth-routes'

import type { GuardedRouteProps } from './types'

function GuardedRoute({ target, isAuthenticated }: GuardedRouteProps): JSX.Element | null {
    const location = useLocation()
    return isAuthenticated ? (
        target
    ) : (
        <Navigate to={authNavigate('login')} state={{ from: location }} replace={true} />
    )
}

export { GuardedRoute }
