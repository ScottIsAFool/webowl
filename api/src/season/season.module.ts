import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FixtureModule } from '../fixture/fixture.module'
import { LeagueModule } from '../league/league.module'
import { TeamModule } from '../team/team.module'

import { SeasonController } from './season.controller'
import { Season } from './season.entity'
import { SeasonService } from './season.service'

@Module({
    imports: [TypeOrmModule.forFeature([Season]), LeagueModule, TeamModule, FixtureModule],
    controllers: [SeasonController],
    providers: [SeasonService],
    exports: [SeasonService],
})
export class SeasonModule {}
