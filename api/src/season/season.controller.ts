import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'

import { JwtGuard } from '../auth/jwt.guard'
import { LeagueService } from '../league/league.service'
import { Role } from '../league/league-role.decorator'
import { RoleGuard } from '../league/league-role.guard'
import { RequiresLeagueId } from '../league/requires-league-id.decorator'
import { TeamService } from '../team/team.service'
import { endpoint } from '../utils/endpoint-utils'

import { SeasonService } from './season.service'

import type { AddSeasonRequest, SeasonResponse, SeasonsResponse } from '@webowl/apiclient'

@Controller('seasons')
@UseGuards(JwtGuard, RoleGuard)
export class SeasonController {
    constructor(
        private readonly seasonService: SeasonService,
        private readonly leagueService: LeagueService,
        private readonly teamsService: TeamService,
    ) {}

    @RequiresLeagueId()
    @Role('admin', 'user')
    @Get(endpoint('/'))
    async getSeasonsForLeague(@Query('leagueId') leagueId: number): Promise<SeasonsResponse> {
        const seasons = await this.seasonService.getSeasons(leagueId)
        return {
            seasons: seasons.map((x) => x.toDto()),
        }
    }

    @RequiresLeagueId()
    @Role('admin')
    @Post(endpoint('/'))
    async addSeasonToLeague(@Body() request: AddSeasonRequest): Promise<SeasonResponse> {
        const seasonData = await this.seasonService.generateSeasonData(request)

        return {
            season: seasonData.toDto(),
        }
    }

    @Role('admin')
    @Delete(endpoint('/:seasonId'))
    async deleteSeason(@Param('seasonId') seasonId: number): Promise<void> {
        await this.seasonService.remove(seasonId)
    }
}
