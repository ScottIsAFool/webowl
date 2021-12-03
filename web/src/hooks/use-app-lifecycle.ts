import * as React from 'react'
import { actions } from '../reducers/actions'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { useLeagueManagement, useUserManagement } from '.'

export type AppLifecycleResult = {
    busy: boolean
    startup: () => void
}

function useAppLifecycle(): AppLifecycleResult {
    const [busy, setBusy] = React.useState(false)
    const { refreshAuthenticatedUser } = useUserManagement()
    const { getLeagues } = useLeagueManagement()
    const authenticatedUser = useAppSelector((state) => state.authenticatedUser)
    const dispatch = useAppDispatch()
    const startup = React.useCallback(
        async function startup() {
            if (!authenticatedUser) return
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
        [authenticatedUser, dispatch, getLeagues, refreshAuthenticatedUser],
    )

    return {
        busy,
        startup,
    }
}

export { useAppLifecycle }
