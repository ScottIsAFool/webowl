import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from '.'

import type { FindOneOptions, Repository } from 'typeorm'

type UserOptions = {
    includeCreatedLeagues?: boolean
    includeMembersOfLeagues?: boolean
}

export type GetUserBy = (
    | { type: 'userId'; userId: number }
    | { type: 'email'; emailAddress: string }
) & {
    options?: UserOptions
}

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    getUserByGoogleId(googleId: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                googleId: googleId,
            },
        })
    }

    getByEmail(emailAddress: string, options?: UserOptions): Promise<User | undefined> {
        return this.get({ type: 'email', emailAddress, options })
    }

    getById(id: number, options?: UserOptions): Promise<User | undefined> {
        return this.get({ type: 'userId', userId: id, options })
    }

    get(by: GetUserBy): Promise<User | undefined> {
        const userOptions: FindOneOptions<User> =
            by.type === 'email'
                ? {
                      where: { emailAddress: by.emailAddress },
                  }
                : { where: { id: by.userId } }

        this.addUserOptions(userOptions, by.options)

        return this.userRepository.findOne(userOptions)
    }

    save(entity: User): Promise<User> {
        return this.userRepository.save(entity)
    }

    private addUserOptions(userOptions: FindOneOptions<User>, options?: UserOptions) {
        if (options) {
            const relations: string[] = []

            if (options.includeCreatedLeagues) {
                relations.push('leagues')
            }

            if (relations.length > 0) {
                userOptions.relations = relations
            }
        }
    }
}
