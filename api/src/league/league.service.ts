import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { User, UserService } from '../user'
import { LeagueRole } from './league-role.entity'
import { League } from './league.entity'

@Injectable()
export class LeagueService {
    constructor(
        @InjectRepository(League) private readonly leagueRepository: Repository<League>,
        @InjectRepository(LeagueRole) private readonly roleRepository: Repository<LeagueRole>,
        private readonly userService: UserService,
    ) {}

    save(league: Partial<League>): Promise<League> {
        return this.leagueRepository.save(league)
    }

    saveRole(leagueRole: Partial<LeagueRole>): Promise<LeagueRole> {
        return this.roleRepository.save(leagueRole)
    }

    async delete(leagueId: number): Promise<void> {
        await this.leagueRepository.delete({ id: leagueId })
    }

    async getUserLeagues(userId: number): Promise<League[]> {
        const roles = await this.roleRepository.find({ where: { user: { id: userId } } })
        const leagues = roles.map((x) => x.league)
        return leagues
    }

    async addLeague(league: League, user: User): Promise<League> {
        league.createdBy = user
        const savedLeague = await this.save(league)

        const role = LeagueRole.create({ user, league, role: 'admin' })
        await this.saveRole(role)

        if (!user.defaultLeagueId) {
            user.defaultLeagueId = savedLeague.id
            await this.userService.save(user)
        }

        return savedLeague
    }
}
