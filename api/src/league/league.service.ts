import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { UserService } from '../user'
import { League } from './league.entity'

@Injectable()
export class LeagueService {
    constructor(
        @InjectRepository(League) private readonly leagueRepository: Repository<League>,
        private readonly userService: UserService,
    ) {}

    save(league: Partial<League>): Promise<League> {
        return this.leagueRepository.save(league)
    }

    async delete(leagueId: number): Promise<void> {
        await this.leagueRepository.delete({ id: leagueId })
    }

    async getUserLeagues(userId: number): Promise<League[]> {
        const user = await this.userService.getById(userId, { includeLeagues: true })
        return user?.leagues ?? []
    }
}