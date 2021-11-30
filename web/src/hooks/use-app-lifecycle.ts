import * as React from 'react'
import { useAccountCreation, useLeagueManagement } from '.'

export type AppLifecycleResult = {
    startup: () => void
}

function useAppLifecycle(): AppLifecycleResult {
    const { getAuthenticatedUser } = useAccountCreation()
    const { getLeagues } = useLeagueManagement()
    const startup = React.useCallback(
        async function startup() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [authenticatedUser, leagues] = await Promise.all([
                getAuthenticatedUser(),
                getLeagues(),
            ])
        },
        [getAuthenticatedUser, getLeagues],
    )

    return {
        startup,
    }
}

export { useAppLifecycle }
