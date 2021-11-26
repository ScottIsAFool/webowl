import { isValidPassword } from './auth.utils'

describe('auth utils', () => {
    describe('isValidPassword', () => {
        test.each([
            'kwijibo',
            'kwijibo2',
            'longpasswordnonumbers',
            'longpasswordnumber5nospecial',
            'longpassword!!',
            'valid exceptTheSpace20!',
        ])('throws if password (%p) not strong enough', async (password: string) => {
            expect(isValidPassword(password)).toBeFalsy()
        })
    })
})
