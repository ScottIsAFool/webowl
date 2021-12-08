import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Season } from './season.entity'

import type { Repository } from 'typeorm'

@Injectable()
export class SeasonService {
    constructor(@InjectRepository(Season) private readonly seasonRepository: Repository<Season>) {}

    getSeasons(leagueId: number): Promise<Season[]> {
        return this.seasonRepository.find({ where: { league: { id: leagueId } } })
    }

    save(season: Season): Promise<Season> {
        return this.seasonRepository.save(season)
    }

    async remove(seasonId: number): Promise<void> {
        await this.seasonRepository.delete({ id: seasonId })
    }
}
