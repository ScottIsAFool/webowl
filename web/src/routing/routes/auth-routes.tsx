import * as React from 'react'
import { useRoutes } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Login, Register } from '../../pages/auth'
import { IsAuthenticated } from '../is-authenticated'
import { RouteResult } from '../types'

function AuthRoutes(): RouteResult {
    const { isAuthenticated } = useAuth()
    const element = useRoutes([
        {
            path: '/register',
            element: <IsAuthenticated target={<Register />} isAuthenticated={isAuthenticated} />,
        },
        {
            path: '/register-success/:email',
        },
        {
            path: '/verify-email/:email/:code',
        },
        {
            path: '/verify-email/:email',
        },
        {
            path: '/verify-email',
        },
        {
            path: '/password-reset',
        },
        {
            path: '/password-reset/:email',
        },
        {
            path: '/password-reset/:email/:code',
        },
        {
            path: '/request-password-reset',
        },
        {
            path: '/login',
            element: <IsAuthenticated target={<Login />} isAuthenticated={isAuthenticated} />,
        },
    ])

    return element
}

export { AuthRoutes }
