import { Controller } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '../repositories'

@Controller('auth')
export class AuthController {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    ) {}
}
