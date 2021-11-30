import type { AddLeagueRequest, LeagueResponse, LeaguesResponse } from '@webowl/apiclient'
import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthUser } from '../auth/auth-user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import type { User } from '../user'
import { endpoint } from '../utils/endpoint-utils'
import { LeagueService } from './league.service'
import { League } from './league.entity'
import { validate } from 'class-validator'

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
}
