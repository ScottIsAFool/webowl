import * as React from 'react'
import { Navigate, RouteObject } from 'react-router-dom'
import { Login } from '../../pages/auth'
import { IsAuthenticated } from '../is-authenticated'

function authRoutes(isAuthenticated: boolean): RouteObject[] {
    return [
        {
            path: 'auth/',
            children: [
                {
                    path: '',
                    element: <Navigate to="/auth/login" />,
                },
                {
                    path: 'login',
                    element: (
                        <IsAuthenticated target={<Login />} isAuthenticated={isAuthenticated} />
                    ),
                },
                // {
                //     path: '/register-success/:email',
                // },
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
