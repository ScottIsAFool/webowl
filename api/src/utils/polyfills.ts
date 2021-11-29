import fetch from 'cross-fetch'

/**
 * Adds missing global access for fetch.
 */
export function polyfillFetch(): void {
    globalThis.fetch = fetch as unknown as (
        input: RequestInfo,
        init?: RequestInit,
    ) => Promise<Response>
}
