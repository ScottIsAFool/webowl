import { Test, TestingModule } from '@nestjs/testing'

import { PingController } from './ping.controller'

describe('PingController', () => {
    let app: TestingModule

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [PingController],
        }).compile()
    })

    describe('ping', () => {
        it('should return "pong"', () => {
            const pingController = app.get<PingController>(PingController)
            expect(pingController.ping()).toBe('pong')
        })
    })
})
