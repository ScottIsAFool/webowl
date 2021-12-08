import * as React from 'react'

import { About, Home, NotFound } from '../../pages'
import { IsHomeAuthenticated } from '../is-authenticated'

import type { RouteObject } from 'react-router-dom'

function appRoutes(isAuthenticated: boolean): RouteObject[] {
    return [
        {
            path: '/',
            element: <IsHomeAuthenticated target={<Home />} isAuthenticated={isAuthenticated} />,
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
