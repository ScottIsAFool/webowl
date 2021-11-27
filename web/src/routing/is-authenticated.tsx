import * as React from 'react'
import { Navigate } from 'react-router-dom'

function IsAuthenticated({
    isAuthenticated,
    target,
}: {
    isAuthenticated: boolean
    target: JSX.Element
}): JSX.Element | null {
    return isAuthenticated ? <Navigate to="/leagues" replace={true} /> : target
}

export { IsAuthenticated }
