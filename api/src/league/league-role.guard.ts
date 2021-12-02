import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { LeagueRole } from '@webowl/apiclient'
import type { Request } from 'express'
import type { AuthRequest } from '../auth/types'
import { LeagueService } from './league.service'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly leagueService: LeagueService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>()
        const params = request.params
        const { id } = params
        if (!id) return Promise.resolve(true)

        const routePermissions = this.reflector.get<LeagueRole[]>('roles', context.getHandler())

        const { user } = context.getArgs()[0] as AuthRequest
        const league = await this.leagueService.getLeague(parseInt(id), { includeUsers: true })
        const role = league?.leagueRoles.find(
            (x) =>
                x.user.id === user.id &&
                x.league.id === parseInt(id) &&
                routePermissions.includes(x.role),
        )

        return Boolean(role)
    }
}
