import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { LeagueController } from './league.controller'
import { League } from './league.entity'
import { LeagueService } from './league.service'

@Module({
    imports: [TypeOrmModule.forFeature([League]), UserModule],
    controllers: [LeagueController],
    providers: [LeagueService],
})
export class LeagueModule {}
