import * as React from 'react'
import { useLeagueManagement, useUserManagement } from '.'

export type AppLifecycleResult = {
    startup: () => void
}

function useAppLifecycle(): AppLifecycleResult {
    const { refreshAuthenticatedUser } = useUserManagement()
    const { getLeagues } = useLeagueManagement()
    const startup = React.useCallback(
        async function startup() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, leagues] = await Promise.all([refreshAuthenticatedUser(), getLeagues()])
        },
        [getLeagues, refreshAuthenticatedUser],
    )

    return {
        startup,
    }
}

export { useAppLifecycle }
