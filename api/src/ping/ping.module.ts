import { Module } from '@nestjs/common'

import { PingController } from '.'

@Module({
    controllers: [PingController],
})
export class PingModule {}
