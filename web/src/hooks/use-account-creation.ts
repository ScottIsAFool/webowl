import * as React from 'react'
import type { CheckEmailResponse, UserResponse } from '@webowl/apiclient'
import { useApiClient, useAuth } from '.'
import { makeCall, makeCallWithValue, Result, ResultWith } from '../utils/result-utils'

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
    getAuthenticatedUser: () => Promise<Result>
}

function useAccountCreation(): AccountCreationResult {
    const { updateAuthDetails } = useAuth()
    const { apiClient } = useApiClient()
    const [busy, setBusy] = React.useState(false)

    const login = React.useCallback(
        function login(emailAddress: string, password: string): Promise<Result> {
            if (!emailAddress || !password) {
                return Promise.resolve({ type: 'error', message: 'No login details provided' })
            }
            return makeCall(async () => {
                const response = await apiClient.login({ emailAddress, password })
                updateAuthDetails(response)
            }, setBusy)
        },
        [apiClient, updateAuthDetails],
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
                updateAuthDetails(response)
            }, setBusy)
        },
        [apiClient, updateAuthDetails],
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
        function verifyEmail(emailAddress: string, verificationCode: string): Promise<Result> {
            return makeCall(
                () => apiClient.verifyEmail({ emailAddress, verificationCode }),
                setBusy,
            )
        },
        [apiClient],
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

    const getAuthenticatedUser = React.useCallback(
        function getAuthenticatedUser(): Promise<ResultWith<UserResponse>> {
            return makeCallWithValue(() => apiClient.getAuthenticatedUser(), setBusy)
        },
        [apiClient],
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
        getAuthenticatedUser,
    }
}

export { useAccountCreation }
