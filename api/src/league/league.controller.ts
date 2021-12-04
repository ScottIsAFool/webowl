import type {
    AcceptLeagueInviteRequest,
    AddLeagueRequest,
    InviteToLeagueRequest,
    LeagueResponse,
    LeaguesResponse,
    LeagueUsersResponse,
} from '@webowl/apiclient'
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common'
import { AuthUser } from '../auth/auth-user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import type { User } from '../user'
import { endpoint } from '../utils/endpoint-utils'
import { LeagueService } from './league.service'
import { League } from './league.entity'
import { validate } from 'class-validator'
import { Role } from './league-role.decorator'
import { RoleGuard } from './league-role.guard'
import { LeagueRole } from './league-role.entity'

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

    @UseGuards(JwtGuard, RoleGuard)
    @Role('admin')
    @Post('/:id/invite')
    async sendLeagueInvite(
        @AuthUser() user: User,
        @Param('id') leagueId: number,
        @Body() request: InviteToLeagueRequest,
    ): Promise<void> {
        const league = await this.leagueService.getLeague(leagueId)
        if (!league) {
            throw new NotFoundException('League not found')
        }
        await this.leagueService.sendInviteToJoinLeague(user, league, request.emailAddress)
    }

    @UseGuards(JwtGuard)
    @Post('/accept-invite')
    async acceptLeagueInvite(
        @AuthUser() user: User,
        @Body() request: AcceptLeagueInviteRequest,
    ): Promise<LeagueResponse> {
        const invite = await this.leagueService.getInvite(request.inviteCode)
        if (!invite) {
            throw new NotFoundException('Invitiation not found to join this league')
        }

        const league = await this.leagueService.acceptInvite(invite, user)

        return {
            league: league.toDto(),
        }
    }
}
