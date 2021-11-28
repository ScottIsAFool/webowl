import * as React from 'react'
import styles from './app.module.css'
import { useRoutes } from 'react-router-dom'
import { routes } from './routing/routes'
import { Box } from '@doist/reactist'
import { Header } from './components'
import { useAuth } from './hooks'

function App(): JSX.Element {
    const { isAuthenticated } = useAuth()
    const element = useRoutes(routes(isAuthenticated))
    return (
        <Box
            display="flex"
            flexDirection="column"
            padding={{
                desktop: 'xlarge',
                tablet: 'xlarge',
                mobile: 'medium',
            }}
            id="container"
            height="full"
        >
            {isAuthenticated ? (
                <header className={styles.app_header}>
                    <Header />
                </header>
            ) : null}

            <Box id="body" height="full">
                {element}
            </Box>
        </Box>
    )
}

export { App }
