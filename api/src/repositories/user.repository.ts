import { Injectable } from '@nestjs/common'
import { EntityRepository, FindOneOptions, Repository } from 'typeorm'
import { User } from '../entities'

type UserOptions = Record<string, never>

export type GetUserBy = (
    | { type: 'userId'; userId: number }
    | { type: 'email'; emailAddress: string }
) & {
    options?: UserOptions
}

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    getUserByGoogleId(googleId: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                googleId: googleId,
            },
        })
    }

    getByEmail(emailAddress: string, options?: UserOptions): Promise<User | undefined> {
        return this.get({ type: 'email', emailAddress, options })
    }

    get(by: GetUserBy): Promise<User | undefined> {
        const userOptions: FindOneOptions<User> =
            by.type === 'email'
                ? {
                      where: { emailAddress: by.emailAddress },
                  }
                : { where: { id: by.userId } }

        this.addUserOptions(userOptions, by.options)

        return this.findOne(userOptions)
    }

    private addUserOptions(userOptions: FindOneOptions<User>, options?: UserOptions) {
        if (options) {
            const relations: string[] = []

            if (relations.length > 0) {
                userOptions.relations = relations
            }
        }
    }
}
