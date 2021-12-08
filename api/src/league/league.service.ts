import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EmailService } from '../email/email.service'
import { User, UserService } from '../user'

import { League } from './league.entity'
import { LeagueInvite } from './league-invite.entity'
import { LeagueRole } from './league-role.entity'

import type { LeagueRole as Role } from '@webowl/apiclient'
import type { FindOneOptions, Repository } from 'typeorm'

type LeagueOptions = {
    includeUsers?: boolean
}

@Injectable()
export class LeagueService {
    constructor(
        @InjectRepository(League) private readonly leagueRepository: Repository<League>,
        @InjectRepository(LeagueRole) private readonly roleRepository: Repository<LeagueRole>,
        @InjectRepository(LeagueInvite) private readonly inviteRepository: Repository<LeagueInvite>,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
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

    async getLeague(leagueId: number, options?: LeagueOptions): Promise<League | undefined> {
        const leagueOptions: FindOneOptions<League> = {
            where: { id: leagueId },
        }

        this.addLeagueOptions(leagueOptions, options)

        return this.leagueRepository.findOne(leagueOptions)
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

    async sendInviteToJoinLeague(user: User, league: League, emailAddress: string): Promise<void> {
        let invite = await this.getInviteByEmail(emailAddress)
        if (!invite) {
            invite = LeagueInvite.create({
                league,
                invitee: user,
                inviteEmail: emailAddress,
            })

            await this.inviteRepository.save(invite)
        }
        await this.emailService.sendLeagueInvitation(invite)
    }

    getInvite(inviteCode: string): Promise<LeagueInvite | undefined> {
        return this.inviteRepository.findOne({ where: { inviteCode } })
    }

    getInviteByEmail(emailAddress: string): Promise<LeagueInvite | undefined> {
        return this.inviteRepository.findOne({ where: { inviteEmail: emailAddress } })
    }

    async acceptInvite(invite: LeagueInvite, user: User): Promise<League> {
        const role = LeagueRole.create({
            role: 'user',
            league: invite.league,
            user,
        })

        await this.saveRole(role)

        if (!user.defaultLeagueId) {
            user.defaultLeagueId = invite.league.id
            await this.userService.save(user)
        }

        await this.inviteRepository.remove(invite)

        return invite.league
    }

    async updateRole(
        leagueId: number,
        userId: number,
        role: Role,
    ): Promise<LeagueRole | undefined> {
        const leagueRole = await this.roleRepository.findOne({
            where: {
                league: { id: leagueId },
                user: { id: userId },
            },
        })

        if (!leagueRole) return undefined

        leagueRole.role = role

        return await this.roleRepository.save(leagueRole)
    }

    async getLeagueUsers(leagueId: number): Promise<
        {
            user: User
            role: Role
        }[]
    > {
        const league = await this.getLeague(leagueId, { includeUsers: true })
        const users = league?.leagueRoles.map((x) => ({ user: x.user, role: x.role })) ?? []
        return users
    }

    async deleteRole(leagueId: number, userId: number): Promise<boolean | undefined> {
        const leagueRole = await this.roleRepository.findOne({
            where: {
                league: { id: leagueId },
                user: { id: userId },
            },
        })

        if (!leagueRole) return undefined

        const allUsers = await this.getLeagueUsers(leagueId)
        const remainingUsers = allUsers.filter((x) => x.user.id !== userId)

        if (!remainingUsers.some((x) => x.role === 'admin')) return false

        await this.roleRepository.remove(leagueRole)

        // Check to see if that user has any leagues left, if not, remove the default
        const userLeagues = await this.getUserLeagues(userId)
        if (userLeagues.length === 0) {
            const user = await this.userService.getById(userId)
            if (user) {
                user.defaultLeagueId = undefined
                await this.userService.save(user)
            }
        }

        return true
    }

    private addLeagueOptions(leagueOptions: FindOneOptions<League>, options?: LeagueOptions) {
        if (options) {
            const relations: string[] = []

            if (options.includeUsers) {
                relations.push('leagueRoles')
            }

            if (relations.length > 0) {
                leagueOptions.relations = relations
            }
        }
    }
}
