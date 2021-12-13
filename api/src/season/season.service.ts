import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'

import { Fixture } from '../fixture/fixture.entity'
import { FixtureService } from '../fixture/fixture.service'
import { LeagueService } from '../league/league.service'
import { Round } from '../round/round.entity'
import { TeamService } from '../team/team.service'

import { Season } from './season.entity'

import type { AddSeasonRequest } from '@webowl/apiclient'
import type { Repository } from 'typeorm'
import type { League } from '../league/league.entity'

@Injectable()
export class SeasonService {
    constructor(
        @InjectRepository(Season) private readonly seasonRepository: Repository<Season>,
        private readonly leagueService: LeagueService,
        private readonly fixtureService: FixtureService,
        private readonly teamsService: TeamService,
    ) {}

    private readonly logger = new Logger(SeasonService.name)

    getSeasons(leagueId: number): Promise<Season[]> {
        return this.seasonRepository.find({ where: { league: { id: leagueId } } })
    }

    save(season: Season): Promise<Season> {
        return this.seasonRepository.save(season)
    }

    async remove(seasonId: number): Promise<void> {
        await this.seasonRepository.delete({ id: seasonId })
    }

    async generateSeasonData(request: AddSeasonRequest): Promise<Season> {
        const { leagueId, ...rest } = request
        const league = (await this.leagueService.getLeague(leagueId)) as League
        const season = Season.create(rest)
        season.league = league

        const baseTeams = this.teamsService.createBaseTeams(season.teamNumbers)
        season.teams = baseTeams

        await this.save(season)

        const generatedFixtures = await this.fixtureService.generateAllFixtures(
            season.teams,
            season.rounds,
        )

        this.logger.debug({ generatedFixtures })

        let startDate = dayjs(season.startDate)
        const rounds = generatedFixtures.map((round, i) => {
            startDate = i === 0 ? startDate : startDate.add(season.frequency, 'days')
            const roundEntity = Round.create({
                date: startDate.toDate(),
                isEmpty: false,
            })
            const fixtures = round.matches.map((match) => {
                const fixture = new Fixture()
                fixture.startLane = 1
                fixture.teams = [match.teamA, match.teamB]
                return fixture
            })
            roundEntity.fixtures = fixtures
            return roundEntity
        })

        season.allRounds = rounds

        await this.seasonRepository.save(season)

        if (!league.activeSeasonId) {
            league.activeSeasonId = season.id
            await this.leagueService.save(league)
        }

        return season
    }
}
