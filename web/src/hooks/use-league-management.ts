import * as React from 'react'
import type {
    AddSeasonRequest,
    League,
    LeagueResponse,
    LeagueRole,
    LeaguesResponse,
    LeagueUsersResponse,
    SeasonResponse,
    SeasonsResponse,
    UpdateRoleResponse,
} from '@webowl/apiclient'
import { makeCall, makeCallWithValue, Result, ResultWith } from '../utils/result-utils'
import { useApiClient } from '.'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { actions } from '../reducers/actions'

type LeagueManagementResult = {
    busy: boolean
    getLeagues: () => Promise<ResultWith<LeaguesResponse>>
    addLeague: (league: Omit<League, 'id' | 'createdById'>) => Promise<ResultWith<LeagueResponse>>
    getLeagueUsers: (leagueId?: number) => Promise<ResultWith<LeagueUsersResponse>>
    getDefaultLeagueUsers: () => Promise<ResultWith<LeagueUsersResponse>>
    sendUserInvite: (leagueId: number, emailAddress: string) => Promise<Result>
    acceptUserInvite: (inviteCode: string) => Promise<ResultWith<LeagueResponse>>
    updateUserRole: (
        userId: number,
        role: LeagueRole,
        leagueId: number,
    ) => Promise<ResultWith<UpdateRoleResponse>>
    deleteLeagueUser: (leagueId: number, userId: number) => Promise<Result>
    getSeasons: (leagueId: number) => Promise<ResultWith<SeasonsResponse>>
    addSeason: (request: AddSeasonRequest) => Promise<ResultWith<SeasonResponse>>
}

function useLeagueManagement(): LeagueManagementResult {
    const [busy, setBusy] = React.useState(false)
    const { apiClient } = useApiClient()
    const authenticatedUser = useAppSelector((state) => state.authenticatedUser)
    const dispatch = useAppDispatch()
    const getLeagues = React.useCallback(
        function getLeagues() {
            return makeCallWithValue(async () => {
                const response = await apiClient.getLeagues()
                dispatch(actions.mergeLeagues(response.leagues))
                return response
            }, setBusy)
        },
        [apiClient, dispatch],
    )

    const addLeague = React.useCallback(
        async function addLeague(league: Omit<League, 'id' | 'createdById'>) {
            const response = await makeCallWithValue(() => apiClient.addLeague(league), setBusy)
            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeague(response.value.league))
            }

            return response
        },
        [apiClient, dispatch],
    )

    const getLeagueUsers = React.useCallback(
        async function getLeagueUsers(leagueId?: number): Promise<ResultWith<LeagueUsersResponse>> {
            if (!authenticatedUser || !leagueId) return { type: 'idle' }
            const response = await makeCallWithValue(() => apiClient.getLeagueUsers(leagueId))
            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeagueUsers({ leagueId, users: response.value.users }))
            }
            return response
        },
        [apiClient, authenticatedUser, dispatch],
    )

    const getDefaultLeagueUsers = React.useCallback(
        async function getLeagueUsers(): Promise<ResultWith<LeagueUsersResponse>> {
            if (!authenticatedUser?.defaultLeagueId) return { type: 'idle' }
            const leagueId = authenticatedUser.defaultLeagueId
            const response = await makeCallWithValue(() => apiClient.getLeagueUsers(leagueId))
            if (response.type === 'success') {
                dispatch(
                    actions.addOrUpdateLeagueUsers({
                        leagueId,
                        users: response.value.users,
                    }),
                )
            }
            return response
        },
        [apiClient, authenticatedUser, dispatch],
    )

    const sendUserInvite = React.useCallback(
        function sendUserInvite(leagueId: number, emailAddress: string) {
            return makeCall(() => apiClient.sendLeagueInvite(leagueId, { emailAddress }), setBusy)
        },
        [apiClient],
    )

    const acceptUserInvite = React.useCallback(
        async function acceptUserInvite(inviteCode: string) {
            const response = await makeCallWithValue(
                () => apiClient.acceptLeagueInvite({ inviteCode }),
                setBusy,
            )

            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeague(response.value.league))
                const users = await getLeagueUsers(response.value.league.id)
                if (users.type === 'success') {
                    dispatch(
                        actions.addOrUpdateLeagueUsers({
                            leagueId: response.value.league.id,
                            users: users.value.users,
                        }),
                    )
                }
            }

            return response
        },
        [apiClient, dispatch, getLeagueUsers],
    )

    const updateUserRole = React.useCallback(
        async function updateUserRole(
            userId: number,
            role: LeagueRole,
            leagueId: number,
        ): Promise<ResultWith<UpdateRoleResponse>> {
            const response = await makeCallWithValue(
                () =>
                    apiClient.updateLeagueRole(leagueId, {
                        role,
                        userId,
                    }),
                setBusy,
            )

            if (response.type === 'success') {
                dispatch(actions.updateLeagueUser({ leagueId, user: response.value.user }))
            }

            return response
        },
        [apiClient, dispatch],
    )

    const deleteLeagueUser = React.useCallback(
        async function deleteLeagueUser(leagueId: number, userId: number) {
            const response = await makeCall(
                () => apiClient.deleteLeagueUser(leagueId, { userId }),
                setBusy,
            )
            if (response.type === 'success') {
                dispatch(actions.deleteLeagueUser({ leagueId, userId }))
            }

            return response
        },
        [apiClient, dispatch],
    )

    const getSeasons = React.useCallback(
        async function getSeasons(leagueId: number) {
            const response = await makeCallWithValue(() => apiClient.getSeasons({ leagueId }))

            if (response.type === 'success') {
                const { seasons } = response.value
                dispatch(actions.addOrUpdateSeasons({ leagueId, seasons }))
            }

            return response
        },
        [apiClient, dispatch],
    )

    const addSeason = React.useCallback(
        async function addSeason(request: AddSeasonRequest) {
            const response = await makeCallWithValue(() => apiClient.addSeason(request))

            if (response.type === 'success') {
                const { season } = response.value
                dispatch(actions.addSeason(season))
            }

            return response
        },
        [apiClient, dispatch],
    )

    return {
        busy,
        getLeagues,
        addLeague,
        getLeagueUsers,
        getDefaultLeagueUsers,
        sendUserInvite,
        acceptUserInvite,
        updateUserRole,
        deleteLeagueUser,
        getSeasons,
        addSeason,
    }
}

export { useLeagueManagement }
