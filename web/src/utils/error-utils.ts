import { ApiException } from '@webowl/apiclient'

export function errorMessage(
    e: unknown,
    customMessage?: string,
): {
    type: 'error'
    message: string
} {
    const error = e as ApiException
    if ('messageText' in error) {
        return { type: 'error', message: error.messageText }
    }

    const standardError = e as Error
    if ('message' in standardError) {
        return { type: 'error', message: error.message }
    }
    return { type: 'error', message: customMessage ?? 'Something went wrong' }
}
