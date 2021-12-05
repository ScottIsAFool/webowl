import type { AuthEndpoints, LeagueEndpoints, SeasonEndpoints } from '@webowl/apiclient'

type Endpoint = AuthEndpoints | LeagueEndpoints | SeasonEndpoints

export function endpoint(endpoint: Endpoint): string {
    return endpoint
}
