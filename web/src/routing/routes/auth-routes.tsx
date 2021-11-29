import * as React from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import { Login, ResendVerification, VerifyEmail } from '../../pages/auth'
import { IsAuthenticated } from '../is-authenticated'

type AuthRoute = 'login' | 'resend-verification' | 'verify-email/:email/:code'

function ar(route: AuthRoute): string {
    return route
}

export function authNavigate(route: AuthRoute): string {
    return `/auth/${route}`
}

function authRoutes(isAuthenticated: boolean): RouteObject[] {
    return [
        {
            path: 'auth/',
            children: [
                {
                    index: true,
                    element: <Navigate to={authNavigate('login')} />,
                },
                {
                    path: ar('login'),
                    element: (
                        <IsAuthenticated target={<Login />} isAuthenticated={isAuthenticated} />
                    ),
                },
                {
                    path: ar('resend-verification'),
                    element: <ResendVerification />,
                },
                {
                    path: ar('verify-email/:email/:code'),
                    element: <VerifyEmail />,
                },
                // {
                //     path: '/verify-email/:email/:code',
                // },
                // {
                //     path: '/verify-email/:email',
                // },
                // {
                //     path: '/verify-email',
                // },
                // {
                //     path: '/password-reset',
                // },
                // {
                //     path: '/password-reset/:email',
                // },
                // {
                //     path: '/password-reset/:email/:code',
                // },
                // {
                //     path: '/request-password-reset',
                // },
            ],
        },
    ]
}

export { authRoutes }
