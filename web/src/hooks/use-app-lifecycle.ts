import * as React from 'react'
import { useUserManagement } from '.'

export type AppLifecycleResult = {
    startup: () => void
}

function useAppLifecycle(): AppLifecycleResult {
    const { getAuthenticatedUser } = useUserManagement()
    const startup = React.useCallback(
        async function startup() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [authenticatedUser] = await Promise.all([getAuthenticatedUser()])
        },
        [getAuthenticatedUser],
    )

    return {
        startup,
    }
}

export { useAppLifecycle }
