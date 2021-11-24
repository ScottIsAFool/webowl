import { Module } from '@nestjs/common'
import { AppController } from '../controllers'

@Module({
    imports: [],
    controllers: [AppController],
})
export class AppModule {}
