import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { LeagueRole } from '@webowl/apiclient'
import type { AuthRequest } from '../auth/types'
import { LeagueService } from './league.service'
import type { RequestWithLeague } from './types'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly leagueService: LeagueService,
    ) {}

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<RequestWithLeague>()
        let requiresLeagueId = this.reflector.get<boolean>('requiresLeagueId', context.getClass())

        if (!requiresLeagueId) {
            requiresLeagueId = this.reflector.get<boolean>('requiresLeagueId', context.getHandler())

            if (!requiresLeagueId) return true
        }

        const id = this.getLeagueId(request)
        if (!id) {
            throw new BadRequestException('No League ID provided')
        }

        const routePermissions = this.reflector.get<LeagueRole[]>('roles', context.getHandler())

        const { user } = context.getArgs()[0] as AuthRequest
        const league = await this.leagueService.getLeague(id, { includeUsers: true })
        if (!league) {
            throw new NotFoundException('No league found with this league ID')
        }
        request.league = league
        const role = league.leagueRoles.find(
            (x) =>
                x.user.id === user.id &&
                x.league.id === league.id &&
                routePermissions.includes(x.role),
        )

        return Boolean(role)
    }

    private getLeagueId(request: RequestWithLeague): number | undefined {
        const { leagueId: idFromParams } = request.params as { leagueId: string | undefined }
        const { leagueId: idFromBody } = request.body as { leagueId: string | undefined }
        const { leagueId: idFromQuery } = request.query as { leagueId: string | undefined }

        if (idFromParams) {
            return parseInt(idFromParams)
        }

        if (idFromBody) {
            return parseInt(idFromBody)
        }

        return idFromQuery ? parseInt(idFromQuery) : undefined
    }
}
