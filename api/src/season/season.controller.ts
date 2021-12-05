import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import type { AddSeasonRequest, SeasonResponse, SeasonsResponse } from '@webowl/apiclient'
import { JwtGuard } from '../auth/jwt.guard'
import { Role } from '../league/league-role.decorator'
import { RoleGuard } from '../league/league-role.guard'
import type { League } from '../league/league.entity'
import { LeagueService } from '../league/league.service'
import { RequiresLeagueId } from '../league/requires-league-id.decorator'
import { endpoint } from '../utils/endpoint-utils'
import { Season } from './season.entity'
import { SeasonService } from './season.service'

@RequiresLeagueId()
@Controller('seasons')
@UseGuards(JwtGuard, RoleGuard)
export class SeasonController {
    constructor(
        private readonly seasonService: SeasonService,
        private readonly leagueService: LeagueService,
    ) {}

    @Role('admin', 'user')
    @Get(endpoint('/'))
    async getSeasonsForLeague(@Query('leagueId') leagueId: number): Promise<SeasonsResponse> {
        const seasons = await this.seasonService.getSeasons(leagueId)
        return {
            seasons: seasons.map((x) => x.toDto()),
        }
    }

    @Role('admin')
    @Post(endpoint('/'))
    async addSeasonToLeague(@Body() request: AddSeasonRequest): Promise<SeasonResponse> {
        const { leagueId, ...rest } = request
        const league = (await this.leagueService.getLeague(leagueId)) as League
        const season = Season.create(rest)
        season.league = league

        const savedSeason = await this.seasonService.save(season)

        return {
            season: savedSeason.toDto(),
        }
    }
}
