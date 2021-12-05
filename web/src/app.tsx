import * as React from 'react'
import styles from './app.module.css'
import { useRoutes } from 'react-router-dom'
import { routes } from './routing/routes'
import { Box, Loading } from '@doist/reactist'
import { Header } from './components'
import { useAppLifecycle, useAuth } from './hooks'
import { AddLeague, AddSeason, LeagueInvite, ManageLeagueUsers } from './components/popups'
import { useAppSelector } from './reducers/hooks'

function App(): JSX.Element {
    const [appLoaded, setAppLoaded] = React.useState(false)
    const { isAuthenticated } = useAuth()
    const { startup } = useAppLifecycle()
    const element = useRoutes(routes(isAuthenticated))
    const { popups } = useAppSelector((state) => state)

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
            <Loading aria-label="App loading..." size="large" />
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

            {popups.addLeague ? <AddLeague /> : null}
            {popups.inviteToLeague ? <LeagueInvite /> : null}
            {popups.manageLeagueUsers ? <ManageLeagueUsers /> : null}
            {popups.addSeason ? <AddSeason /> : null}
        </Box>
    )
}

export { App }
