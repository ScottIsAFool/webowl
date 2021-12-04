import * as React from 'react'
import type { CheckEmailResponse, LoginResponse, SocialProvider } from '@webowl/apiclient'
import { useApiClient, useAuth, useLeagueManagement } from '.'
import { makeCall, makeCallWithValue, Result, ResultWith } from '../utils/result-utils'
import { useAppDispatch } from '../reducers/hooks'
import { actions } from '../reducers/actions'

type AccountCreationResult = {
    busy: boolean
    login: (emailAddress: string, password: string) => Promise<Result>
    register: (
        emailAddress: string,
        password: string,
        firstName: string,
        lastName: string,
    ) => Promise<Result>
    checkEmail: (emailAddress: string) => Promise<ResultWith<CheckEmailResponse>>
    resendVerification: (emailAddress: string) => Promise<Result>
    verifyEmail: (emailAddress: string, verificationCode: string) => Promise<Result>
    requestPasswordReset: (emailAddress: string) => Promise<Result>
    passwordReset: (emailAddress: string, code: string, password: string) => Promise<Result>
    socialLogin: (
        accessToken: string,
        socialId: string,
        provider: SocialProvider,
    ) => Promise<Result>
}

function useAccountCreation(): AccountCreationResult {
    const { updateAuthToken } = useAuth()
    const { apiClient } = useApiClient()
    const { getLeagues, getDefaultLeagueUsers } = useLeagueManagement()
    const [busy, setBusy] = React.useState(false)
    const dispatch = useAppDispatch()

    const postAuth = React.useCallback(
        async function postAuth(response: LoginResponse) {
            dispatch(actions.addOrUpdateUser(response.user))
            updateAuthToken(response.authToken)
            apiClient.setAuthToken(response.authToken)
            await getLeagues()
            await getDefaultLeagueUsers()
        },
        [apiClient, dispatch, getDefaultLeagueUsers, getLeagues, updateAuthToken],
    )

    const login = React.useCallback(
        function login(emailAddress: string, password: string): Promise<Result> {
            if (!emailAddress || !password) {
                return Promise.resolve({ type: 'error', message: 'No login details provided' })
            }
            return makeCall(async () => {
                const response = await apiClient.login({ emailAddress, password })
                await postAuth(response)
            }, setBusy)
        },
        [apiClient, postAuth],
    )

    const register = React.useCallback(
        function register(
            emailAddress: string,
            password: string,
            firstName: string,
            lastName: string,
        ): Promise<Result> {
            if (!emailAddress || !password || !firstName || !lastName)
                return Promise.resolve({ type: 'error', message: 'Details missing' })
            return makeCall(async () => {
                const response = await apiClient.register({
                    emailAddress,
                    firstName,
                    lastName,
                    password,
                })
                await postAuth(response)
            }, setBusy)
        },
        [apiClient, postAuth],
    )

    const checkEmail = React.useCallback(
        function checkEmail(emailAddress: string): Promise<ResultWith<CheckEmailResponse>> {
            if (!emailAddress)
                return Promise.resolve({ type: 'error', message: 'No email address provided' })

            return makeCallWithValue(() => apiClient.checkEmail({ emailAddress }))
        },
        [apiClient],
    )

    const resendVerification = React.useCallback(
        function resendVerification(emailAddress: string): Promise<Result> {
            return makeCall(() => apiClient.resendVerification({ emailAddress }), setBusy)
        },
        [apiClient],
    )

    const verifyEmail = React.useCallback(
        async function verifyEmail(
            emailAddress: string,
            verificationCode: string,
        ): Promise<Result> {
            const response = await makeCall(
                () => apiClient.verifyEmail({ emailAddress, verificationCode }),
                setBusy,
            )

            dispatch(actions.setVerified(response.type === 'success'))
            return response
        },
        [apiClient, dispatch],
    )

    const requestPasswordReset = React.useCallback(
        function requestPasswordReset(emailAddress: string) {
            return makeCall(() => apiClient.requestPasswordReset({ emailAddress }), setBusy)
        },
        [apiClient],
    )

    const passwordReset = React.useCallback(
        function passwordReset(
            emailAddress: string,
            code: string,
            password: string,
        ): Promise<Result> {
            if (!emailAddress || !code || !password)
                return Promise.resolve({ type: 'error', message: 'Missing details' })

            return makeCall(
                () => apiClient.passwordReset({ emailAddress, code, password }),
                setBusy,
            )
        },
        [apiClient],
    )

    const socialLogin = React.useCallback(
        function socialLogin(accessToken: string, socialId: string, provider: SocialProvider) {
            return makeCall(async () => {
                const response = await apiClient.socialLogin({ accessToken, socialId, provider })
                await postAuth(response)
            }, setBusy)
        },
        [apiClient, postAuth],
    )

    return {
        busy,
        login,
        register,
        checkEmail,
        resendVerification,
        verifyEmail,
        requestPasswordReset,
        passwordReset,
        socialLogin,
    }
}

export { useAccountCreation }
