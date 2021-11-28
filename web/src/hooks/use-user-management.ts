import { useApiClient, useAuth } from '.'
import type { ActionResult } from '../types'
import { errorMessage } from '../utils/error-utils'

type UserManagementResult = {
    login: (emailAddress: string, password: string) => Promise<ActionResult>
    register(
        emailAddress: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<ActionResult>
}

function useUserManagement(): UserManagementResult {
    const { updateAuthDetails } = useAuth()
    const { apiClient } = useApiClient()

    async function login(emailAddress: string, password: string): Promise<ActionResult> {
        if (!emailAddress || !password) {
            return { type: 'error', message: 'No login details provided' }
        }
        try {
            const response = await apiClient.login({ emailAddress, password })
            updateAuthDetails(response)
            return { type: 'success' }
        } catch (e: unknown) {
            return errorMessage(e)
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
            await apiClient.register({ emailAddress, firstName, lastName, password })
            return { type: 'success' }
        } catch (e: unknown) {
            return errorMessage(e)
        }
    }

    return {
        login,
        register,
    }
}

export { useUserManagement }
