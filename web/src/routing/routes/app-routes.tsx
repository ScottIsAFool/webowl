import * as React from 'react'
import { useRoutes } from 'react-router-dom'

function AppRoutes(): React.ReactElement | JSX.Element | null {
    // const isAuthenticated = false
    const element = useRoutes([
        {
            path: '/',
            // element: isAuthenticated ? <Navigate to="/something" /> : <Home />,
        },
        {
            path: '*',
            // component: NotFound,
        },
    ])

    return element
}

export { AppRoutes }
