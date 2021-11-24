import type { AuthEndpoints } from '@webowl/apiclient'

type Endpoint = AuthEndpoints

export function endpoint(endpoint: Endpoint): string {
    return endpoint
}
