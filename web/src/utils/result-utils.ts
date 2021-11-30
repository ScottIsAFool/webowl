import { errorMessage } from './error-utils'

export type ResultWith<T> =
    | { type: 'success'; value: T }
    | { type: 'error'; message: string }
    | { type: 'idle' }

export type Result = { type: 'success' } | { type: 'error'; message: string } | { type: 'idle' }

export async function makeCall(
    call: () => Promise<void>,
    setBusy?: (value: boolean) => void,
): Promise<Result> {
    try {
        setBusy?.(true)
        await call()
        return { type: 'success' }
    } catch (e: unknown) {
        return errorMessage(e)
    } finally {
        setBusy?.(false)
    }
}

export async function makeCallWithValue<T>(
    call: () => Promise<T>,
    setBusy?: (value: boolean) => void,
): Promise<ResultWith<T>> {
    try {
        setBusy?.(true)
        const response = await call()
        return { type: 'success', value: response }
    } catch (e: unknown) {
        return errorMessage(e)
    } finally {
        setBusy?.(false)
    }
}
