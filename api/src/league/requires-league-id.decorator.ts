import { CustomDecorator, SetMetadata } from '@nestjs/common'

export function RequiresLeagueId(): CustomDecorator<string> {
    return SetMetadata('requiresLeagueId', true)
}
