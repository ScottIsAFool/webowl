import * as React from 'react'
import type { CheckEmailResponse, UserResponse } from '@webowl/apiclient'
import { useApiClient, useAuth } from '.'
import type { ActionResult, ActionResultWithValue } from '../types'
import { errorMessage } from '../utils/error-utils'

type AccountCreationResult = {
    busy: boolean
    login: (emailAddress: string, password: string) => Promise<ActionResult>
    register: (
        emailAddress: string,
        password: string,
        firstName: string,
        lastName: string,
    ) => Promise<ActionResult>
    checkEmail: (emailAddress: string) => Promise<ActionResultWithValue<CheckEmailResponse>>
    resendVerification: (emailAddress: string) => Promise<ActionResult>
    verifyEmail: (emailAddress: string, verificationCode: string) => Promise<ActionResult>
    requestPasswordReset: (emailAddress: string) => Promise<ActionResult>
    passwordReset: (emailAddress: string, code: string, password: string) => Promise<ActionResult>
    getAuthenticatedUser: () => Promise<ActionResult>
}

function useAccountCreation(): AccountCreationResult {
    const { updateAuthDetails } = useAuth()
    const { apiClient } = useApiClient()
    const [busy, setBusy] = React.useState(false)

    async function makeCall(call: () => Promise<void>): Promise<ActionResult> {
        try {
            setBusy(true)
            await call()
            return { type: 'success' }
        } catch (e: unknown) {
            return errorMessage(e)
        } finally {
            setBusy(false)
        }
    }

    async function makeCallWithValue<T>(call: () => Promise<T>): Promise<ActionResultWithValue<T>> {
        try {
            setBusy(true)
            const response = await call()
            return { type: 'success', value: response }
        } catch (e: unknown) {
            return errorMessage(e)
        } finally {
            setBusy(false)
        }
    }

    const login = React.useCallback(
        async function login(emailAddress: string, password: string): Promise<ActionResult> {
            if (!emailAddress || !password) {
                return { type: 'error', message: 'No login details provided' }
            }
            try {
                setBusy(true)
                const response = await apiClient.login({ emailAddress, password })
                updateAuthDetails(response)
                return { type: 'success' }
            } catch (e: unknown) {
                return errorMessage(e)
            } finally {
                setBusy(false)
            }
        },
        [apiClient, updateAuthDetails],
    )

    const register = React.useCallback(
        function register(
            emailAddress: string,
            password: string,
            firstName: string,
            lastName: string,
        ): Promise<ActionResult> {
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
            })
        },
        [apiClient, updateAuthDetails],
    )

    const checkEmail = React.useCallback(
        function checkEmail(
            emailAddress: string,
        ): Promise<ActionResultWithValue<CheckEmailResponse>> {
            if (!emailAddress)
                return Promise.resolve({ type: 'error', message: 'No email address provided' })

            return makeCallWithValue(() => apiClient.checkEmail({ emailAddress }))
        },
        [apiClient],
    )

    const resendVerification = React.useCallback(
        function resendVerification(emailAddress: string): Promise<ActionResult> {
            return makeCall(() => apiClient.resendVerification({ emailAddress }))
        },
        [apiClient],
    )

    const verifyEmail = React.useCallback(
        function verifyEmail(
            emailAddress: string,
            verificationCode: string,
        ): Promise<ActionResult> {
            return makeCall(() => apiClient.verifyEmail({ emailAddress, verificationCode }))
        },
        [apiClient],
    )

    const requestPasswordReset = React.useCallback(
        function requestPasswordReset(emailAddress: string) {
            return makeCall(() => apiClient.requestPasswordReset({ emailAddress }))
        },
        [apiClient],
    )

    const passwordReset = React.useCallback(
        function passwordReset(
            emailAddress: string,
            code: string,
            password: string,
        ): Promise<ActionResult> {
            if (!emailAddress || !code || !password)
                return Promise.resolve({ type: 'error', message: 'Missing details' })

            return makeCall(() => apiClient.passwordReset({ emailAddress, code, password }))
        },
        [apiClient],
    )

    const getAuthenticatedUser = React.useCallback(
        function getAuthenticatedUser(): Promise<ActionResultWithValue<UserResponse>> {
            return makeCallWithValue(() => apiClient.getAuthenticatedUser())
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
