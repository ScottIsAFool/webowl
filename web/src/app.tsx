import * as React from 'react'
import styles from './app.module.css'
import { useRoutes } from 'react-router-dom'
import { routes } from './routing/routes'
import { Box, Loading } from '@doist/reactist'
import { Header } from './components'
import { useAppLifecycle, useAuth } from './hooks'
import { AddLeague } from './components/popups'

function App(): JSX.Element {
    const { isAuthenticated } = useAuth()
    const { busy, startup } = useAppLifecycle()
    const element = useRoutes(routes(isAuthenticated))

    React.useEffect(function onStartup() {
        startup()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return busy ? (
        <Box
            height="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Loading aria-label="App loading..." />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" id="container" height="full">
            {isAuthenticated ? (
                <header className={styles.app_header}>
                    <Header />
                </header>
            ) : null}

            <Box
                id="body"
                height="full"
                padding={{
                    desktop: 'xlarge',
                    tablet: 'xlarge',
                    mobile: 'medium',
                }}
            >
                {element}
            </Box>

            <AddLeague />
        </Box>
    )
}

export { App }
