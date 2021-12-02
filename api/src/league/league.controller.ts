import type {
    AddLeagueRequest,
    LeagueResponse,
    LeaguesResponse,
    LeagueUsersResponse,
} from '@webowl/apiclient'
import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthUser } from '../auth/auth-user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import type { User } from '../user'
import { endpoint } from '../utils/endpoint-utils'
import { LeagueService } from './league.service'
import { League } from './league.entity'
import { validate } from 'class-validator'
import { Role } from './league-role.decorator'
import { RoleGuard } from './league-role.guard'

@Controller('leagues')
export class LeagueController {
    constructor(private readonly leagueService: LeagueService) {}

    @UseGuards(JwtGuard)
    @Get(endpoint('/'))
    async getUserLeagues(@AuthUser() user: User): Promise<LeaguesResponse> {
        const leagues = await this.leagueService.getUserLeagues(user.id)
        return {
            leagues: leagues.map((x) => x.toDto()),
        }
    }

    @UseGuards(JwtGuard)
    @Post(endpoint('/'))
    async addLeague(
        @AuthUser() user: User,
        @Body() request: AddLeagueRequest,
    ): Promise<LeagueResponse> {
        const leagueEntity = League.create(request)

        const errors = await validate(leagueEntity)
        if (errors.length > 0) {
            throw new BadRequestException(errors)
        }

        const league = await this.leagueService.addLeague(leagueEntity, user)

        return {
            league: league.toDto(),
        }
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Role('admin')
    @Get(endpoint('/:id/users'))
    async getLeagueUsers(@Param('id') leagueId: number): Promise<LeagueUsersResponse> {
        const league = await this.leagueService.getLeague(leagueId, { includeUsers: true })
        const users = league?.leagueRoles.map((x) => ({ user: x.user, role: x.role })) ?? []

        return {
            users: users.map((x) => ({
                id: x.user.id,
                firstName: x.user.firstName,
                lastName: x.user.lastName,
                emailAddress: x.user.emailAddress,
                role: x.role,
            })),
        }
    }
}
