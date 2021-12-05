import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeagueModule } from '../league/league.module'
import { SeasonController } from './season.controller'
import { Season } from './season.entity'
import { SeasonService } from './season.service'

@Module({
    imports: [TypeOrmModule.forFeature([Season]), LeagueModule],
    controllers: [SeasonController],
    providers: [SeasonService],
    exports: [SeasonService],
})
export class SeasonModule {}
