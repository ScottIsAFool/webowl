import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmailModule } from '../email/email.module'
import { UserModule } from '../user/user.module'

import { LeagueController } from './league.controller'
import { League } from './league.entity'
import { LeagueService } from './league.service'
import { LeagueInvite } from './league-invite.entity'
import { LeagueRole } from './league-role.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([League, LeagueRole, LeagueInvite]),
        UserModule,
        EmailModule,
    ],
    controllers: [LeagueController],
    providers: [LeagueService],
    exports: [LeagueService],
})
export class LeagueModule {}
