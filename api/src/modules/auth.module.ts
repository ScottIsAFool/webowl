import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from '../controllers'
import { EmailVerification, User } from '../entities'
import { EmailVerificationRepository, UserRepository } from '../repositories'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserRepository,
            EmailVerification,
            EmailVerificationRepository,
        ]),
    ],
    controllers: [AuthController],
})
export class AuthModule {}
