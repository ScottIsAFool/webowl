import { Injectable } from '@nestjs/common'
import type { User } from '../entities'
import { UserRepository } from '../repositories'

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    async validateUser(emailAddress: string, password: string): Promise<User | undefined> {
        const user = await this.userRepository.getByEmail(emailAddress)
        if (user && user.checkIfPasswordIsValid(password)) {
            return user
        }

        return undefined
    }
}
