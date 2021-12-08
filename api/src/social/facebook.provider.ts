import { Injectable, InternalServerErrorException } from '@nestjs/common'
import axios from 'axios'

import type { SocialProvider } from '@webowl/apiclient'
import type { User } from '../user/user.entity'
import type { ISocialProvider, SocialUser } from './types'

@Injectable()
export class FacebookProvider implements ISocialProvider {
    private readonly _facebookUserUrl =
        'https://graph.facebook.com/me?fields=id,last_name,first_name,email&access_token='

    readonly provider: SocialProvider = 'Facebook'

    async getSocialUser(accessToken: string): Promise<SocialUser> {
        try {
            const url = `${this._facebookUserUrl}${accessToken}`
            const response = await axios.get(url)
            const user = response.data as {
                email: string
                first_name: string
                last_name: string
                id: number
            }

            return {
                id: user.id.toString(),
                firstName: user.first_name,
                lastName: user.last_name,
                emailAddress: user.email,
                accessToken: accessToken,
            }
        } catch (e: unknown) {
            throw new InternalServerErrorException('Comms to facebook broken')
        }
    }
    fillRemainingFields(user: User, socialUser: SocialUser): void {
        user.facebookId = socialUser.id
        user.isFacebookAuth = true
    }
}
