import * as React from 'react'
import { Navigate, Route, useLocation } from 'react-router-dom'
import { GuardedRouteProps } from './types'

function GuardedRoute({ element, isAuthenticated, ...rest }: GuardedRouteProps): JSX.Element {
    const location = useLocation()
    return (
        <Route
            {...rest}
            element={
                isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} />
            }
        />
    )
}

export { GuardedRoute }
