import * as React from 'react'
import type { RouteObject } from 'react-router-dom'
import { About, Home, NotFound } from '../../pages'
import { IsAuthenticated } from '../is-authenticated'

function appRoutes(isAuthenticated: boolean, children: RouteObject[]): RouteObject[] {
    return [
        {
            path: '/',
            element: <IsAuthenticated target={<Home />} isAuthenticated={isAuthenticated} />,
            children,
        },
        {
            path: '/about',
            element: <About />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ]
}

export { appRoutes }
