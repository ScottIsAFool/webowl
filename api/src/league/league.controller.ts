import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common'
import { validate } from 'class-validator'

import { AuthUser } from '../auth/auth-user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { endpoint } from '../utils/endpoint-utils'

import { LeagueRequest } from './league.decorator'
import { League } from './league.entity'
import { LeagueService } from './league.service'
import { Role } from './league-role.decorator'
import { RoleGuard } from './league-role.guard'
import { RequiresLeagueId } from './requires-league-id.decorator'

import type {
    AcceptLeagueInviteRequest,
    AddLeagueRequest,
    InviteToLeagueRequest,
    LeagueResponse,
    LeaguesResponse,
    LeagueUsersResponse,
    UpdateRoleRequest,
    UpdateRoleResponse,
} from '@webowl/apiclient'
import type { User } from '../user'

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
    @HttpCode(HttpStatus.OK)
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

    @RequiresLeagueId()
    @UseGuards(JwtGuard, RoleGuard)
    @Role('admin')
    @Get(endpoint('/:leagueId/users'))
    async getLeagueUsers(@Param('leagueId') leagueId: number): Promise<LeagueUsersResponse> {
        const users = await this.leagueService.getLeagueUsers(leagueId)

        return {
            users: users.map((x) => x.user.toLeagueUserDto(x.role)),
        }
    }

    @RequiresLeagueId()
    @UseGuards(JwtGuard, RoleGuard)
    @Role('admin')
    @HttpCode(HttpStatus.OK)
    @Post('/:leagueId/invite')
    async sendLeagueInvite(
        @AuthUser() user: User,
        @LeagueRequest() league: League,
        @Body() request: InviteToLeagueRequest,
    ): Promise<void> {
        await this.leagueService.sendInviteToJoinLeague(user, league, request.emailAddress)
    }

    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
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

    @RequiresLeagueId()
    @UseGuards(JwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    @Role('admin')
    @Post(endpoint('/:leagueId/update-role'))
    async updateLeagueUser(
        @Param('leagueId') leagueId: number,
        @Body() request: UpdateRoleRequest,
    ): Promise<UpdateRoleResponse> {
        const { userId, role } = request

        const updatedRole = await this.leagueService.updateRole(leagueId, userId, role)
        if (!updatedRole) {
            throw new NotFoundException('This user could not be found for this league')
        }

        return {
            user: updatedRole.user.toLeagueUserDto(role),
        }
    }

    @RequiresLeagueId()
    @UseGuards(JwtGuard, RoleGuard)
    @Role('admin')
    @Delete(endpoint('/:leagueId/user/:userId'))
    async deleteLeagueUser(
        @Param('leagueId') leagueId: number,
        @Param('userId') userId: number,
    ): Promise<void> {
        const response = await this.leagueService.deleteRole(leagueId, userId)
        if (response === undefined) {
            throw new NotFoundException('No user could be found in this league')
        }

        if (!response) {
            throw new BadRequestException(
                'Deleting this user would result in a league having no admins',
            )
        }
    }
}
