import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import type { RequestWithLeague } from './types'

export const LeagueRequest = createParamDecorator((_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithLeague>()
    return request.league
})
