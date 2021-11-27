import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { User } from '../user/user.entity'

export const AuthUser = createParamDecorator((_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as User
})
