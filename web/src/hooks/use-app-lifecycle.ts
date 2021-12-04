import * as React from 'react'
import { actions } from '../reducers/actions'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { useLeagueManagement, useUserManagement } from '.'

export type AppLifecycleResult = {
    busy: boolean
    startup: () => Promise<void>
}

function useAppLifecycle(): AppLifecycleResult {
    const [busy, setBusy] = React.useState(false)
    const { refreshAuthenticatedUser } = useUserManagement()
    const { getLeagues, getLeagueUsers } = useLeagueManagement()
    const authenticatedUser = useAppSelector((state) => state.authenticatedUser)
    const dispatch = useAppDispatch()
    const startup = React.useCallback(
        async function startup() {
            if (!authenticatedUser) return
            setBusy(true)
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [_, leagues, leagueUsers] = await Promise.all([
                    refreshAuthenticatedUser(),
                    getLeagues(),
                    getLeagueUsers(authenticatedUser.defaultLeagueId),
                ])

                if (leagues.type === 'success') {
                    dispatch(actions.mergeLeagues(leagues.value.leagues))
                }

                if (leagueUsers.type === 'success' && authenticatedUser.defaultLeagueId) {
                    dispatch(
                        actions.addOrUpdateLeagueUsers({
                            leagueId: authenticatedUser.defaultLeagueId,
                            users: leagueUsers.value.users,
                        }),
                    )
                }
            } finally {
                setBusy(false)
            }
        },
        [authenticatedUser, dispatch, getLeagueUsers, getLeagues, refreshAuthenticatedUser],
    )

    return {
        busy,
        startup,
    }
}

export { useAppLifecycle }
