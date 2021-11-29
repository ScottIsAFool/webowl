import * as React from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import {
    Login,
    PasswordReset,
    RequestPasswordReset,
    ResendVerification,
    VerifyEmail,
} from '../../pages/auth'
import { IsAuthenticated } from '../is-authenticated'

type AuthRoute =
    | 'login'
    | 'resend-verification'
    | 'verify-email'
    | 'password-reset'
    | 'request-password-reset'

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
                    path: ar('verify-email'),
                    element: <VerifyEmail />,
                },
                {
                    path: ar('password-reset'),
                    element: <PasswordReset />,
                },
                {
                    path: ar('request-password-reset'),
                    element: <RequestPasswordReset />,
                },
            ],
        },
    ]
}

export { authRoutes }
