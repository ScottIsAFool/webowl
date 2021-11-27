import * as React from 'react'
import { useRoutes } from 'react-router-dom'
import { Home, NotFound } from '../../pages'
import { IsAuthenticated } from '../is-authenticated'
import { RouteResult } from '../types'

function AppRoutes(): RouteResult {
    const isAuthenticated = false
    const element = useRoutes([
        {
            path: '/',
            element: <IsAuthenticated target={<Home />} isAuthenticated={isAuthenticated} />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ])

    return element
}

export { AppRoutes }
