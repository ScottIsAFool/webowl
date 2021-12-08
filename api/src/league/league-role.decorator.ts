import { CustomDecorator, SetMetadata } from '@nestjs/common'

import type { LeagueRole } from '@webowl/apiclient'

export function Role(...args: LeagueRole[]): CustomDecorator<string> {
    return SetMetadata('roles', args)
}
