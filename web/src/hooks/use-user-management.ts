import { useApiClient, useAuth } from '.'
import { ActionResult } from '../types'
import { errorMessage } from '../utils/error-utils'

type UserManagementResult = {
    login: (emailAddress: string, password: string) => Promise<ActionResult>
}

function useUserManagement(): UserManagementResult {
    const { updateAuthDetails } = useAuth()
    const { apiClient } = useApiClient()

    async function login(emailAddress: string, password: string): Promise<ActionResult> {
        if (!emailAddress || !password) return { type: 'idle' }
        try {
            const response = await apiClient.login({ emailAddress, password })
            updateAuthDetails(response)
            return { type: 'success' }
        } catch (e: unknown) {
            return errorMessage(e)
        }
    }

    return {
        login,
    }
}

export { useUserManagement }
