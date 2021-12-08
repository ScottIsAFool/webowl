import MockDate from 'mockdate'

import { hasAuthTokenExpired } from './date-utils'

describe('hasAuthTokenExpired', () => {
    beforeAll(() => {
        MockDate.set(new Date('2020-10-23T12:08:00Z').valueOf())
    })

    afterAll(() => MockDate.reset())
    test.each([
        ['2020-10-23T12:08:00Z', false],
        ['2020-10-23T13:07:59Z', false],
        ['2020-10-23T12:07:59Z', true],
    ])('when date is %p returns %p', (expiryDate: string, expectedResult: boolean) => {
        expect(hasAuthTokenExpired(new Date(expiryDate))).toEqual(expectedResult)
    })
})
