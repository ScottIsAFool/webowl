import * as React from 'react'
import { useAccountCreation } from '.'

export type AppLifecycleResult = {
    startup: () => void
}

function useAppLifecycle(): AppLifecycleResult {
    const { getAuthenticatedUser } = useAccountCreation()
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
