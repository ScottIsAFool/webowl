import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { User } from '../entities'
import { UserRepository } from '../repositories'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    ) {}

    async validateUser(emailAddress: string, password: string): Promise<User | undefined> {
        const user = await this.userRepository.getUser({ emailAddress, type: 'email' })
        if (user && user.checkIfPasswordIsValid(password)) {
            return user
        }

        return undefined
    }
}
