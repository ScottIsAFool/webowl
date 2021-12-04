import * as React from 'react'
import styles from './app.module.css'
import { useRoutes } from 'react-router-dom'
import { routes } from './routing/routes'
import { Box, Loading } from '@doist/reactist'
import { Header } from './components'
import { useAppLifecycle, useAuth } from './hooks'
import { AddLeague, LeagueInvite } from './components/popups'
import { useAppSelector } from './reducers/hooks'

function App(): JSX.Element {
    const [appLoaded, setAppLoaded] = React.useState(false)
    const { isAuthenticated } = useAuth()
    const { startup } = useAppLifecycle()
    const element = useRoutes(routes(isAuthenticated))
    const { addLeague, inviteToLeague } = useAppSelector((state) => state.popups)

    React.useEffect(function onStartup() {
        startup()
            .then(() => setAppLoaded(true))
            .finally(() => {
                // noop
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return !appLoaded ? (
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

            {addLeague ? <AddLeague /> : null}
            {inviteToLeague ? <LeagueInvite /> : null}
        </Box>
    )
}

export { App }
