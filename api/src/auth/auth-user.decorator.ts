import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import type { AuthRequest } from './types'

export const AuthUser = createParamDecorator((_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>()
    return request.user
})
