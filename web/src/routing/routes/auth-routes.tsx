import * as React from 'react'
import { useRoutes } from 'react-router-dom'
import { Login } from '../../pages'

function AuthRoutes(): React.ReactElement | JSX.Element | null {
    const element = useRoutes([
        {
            path: '/register',
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
            element: <Login />,
        },
    ])

    return element
}

export { AuthRoutes }
