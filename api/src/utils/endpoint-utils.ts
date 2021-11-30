import type { AuthEndpoints, LeagueEndpoints } from '@webowl/apiclient'

type Endpoint = AuthEndpoints | LeagueEndpoints

export function endpoint(endpoint: Endpoint): string {
    return endpoint
}
