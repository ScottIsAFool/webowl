import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { LeagueRole } from './league-role.entity'
import { LeagueController } from './league.controller'
import { League } from './league.entity'
import { LeagueService } from './league.service'

@Module({
    imports: [TypeOrmModule.forFeature([League, LeagueRole]), UserModule],
    controllers: [LeagueController],
    providers: [LeagueService],
})
export class LeagueModule {}
