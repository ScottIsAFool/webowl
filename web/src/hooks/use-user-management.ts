import * as React from 'react'
import type { CheckEmailResponse } from '@webowl/apiclient'
import { useApiClient, useAuth } from '.'
import type { ActionResult, ActionResultWithValue } from '../types'
import { errorMessage } from '../utils/error-utils'

type UserManagementResult = {
    busy: boolean
    login: (emailAddress: string, password: string) => Promise<ActionResult>
    register(
        emailAddress: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<ActionResult>
    checkEmail: (emailAddress: string) => Promise<ActionResultWithValue<CheckEmailResponse>>
}

function useUserManagement(): UserManagementResult {
    const { updateAuthDetails } = useAuth()
    const { apiClient } = useApiClient()
    const [busy, setBusy] = React.useState(false)

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
    }

    async function register(
        emailAddress: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<ActionResult> {
        if (!emailAddress || !password || firstName || lastName)
            return { type: 'error', message: 'Details missing' }

        try {
            setBusy(true)
            await apiClient.register({ emailAddress, firstName, lastName, password })
            return { type: 'success' }
        } catch (e: unknown) {
            return errorMessage(e)
        } finally {
            setBusy(false)
        }
    }

    async function checkEmail(
        emailAddress: string,
    ): Promise<ActionResultWithValue<CheckEmailResponse>> {
        if (!emailAddress) return { type: 'error', message: 'No email address provided' }

        try {
            setBusy(true)
            const response = await apiClient.checkEmail({ emailAddress })
            return { type: 'success', value: response }
        } catch (e: unknown) {
            return errorMessage(e)
        } finally {
            setBusy(false)
        }
    }

    return {
        busy,
        login,
        register,
        checkEmail,
    }
}

export { useUserManagement }
