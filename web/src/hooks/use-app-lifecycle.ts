import * as React from 'react'
import { actions } from '../reducers/actions'
import { useAppDispatch } from '../reducers/hooks'
import { useLeagueManagement, useUserManagement } from '.'

export type AppLifecycleResult = {
    busy: boolean
    startup: () => void
}

function useAppLifecycle(): AppLifecycleResult {
    const [busy, setBusy] = React.useState(false)
    const { refreshAuthenticatedUser } = useUserManagement()
    const { getLeagues } = useLeagueManagement()
    const dispatch = useAppDispatch()
    const startup = React.useCallback(
        async function startup() {
            setBusy(true)
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [_, leagues] = await Promise.all([refreshAuthenticatedUser(), getLeagues()])

                if (leagues.type === 'success') {
                    dispatch(actions.mergeLeagues(leagues.value.leagues))
                }
            } finally {
                setBusy(false)
            }
        },
        [dispatch, getLeagues, refreshAuthenticatedUser],
    )

    return {
        busy,
        startup,
    }
}

export { useAppLifecycle }
