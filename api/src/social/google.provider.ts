import { Injectable } from '@nestjs/common'
import type { SocialProvider } from '@webowl/apiclient'
import { people_v1 } from 'googleapis'
import { getConfiguration } from '../config/configuration'
import type { User } from '../user/user.entity'
import type { ISocialProvider, SocialUser } from './types'

@Injectable()
export class GoogleProvider implements ISocialProvider {
    constructor() {
        this._people = new people_v1.People({
            auth: getConfiguration().googleAPIKey,
        })
    }
    private readonly _people: people_v1.People

    readonly provider: SocialProvider = 'Google'

    async getSocialUser(accessToken: string): Promise<SocialUser> {
        const response = await this._people.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,names,metadata',
            access_token: accessToken,
        })

        const googleUser = response.data
        const name = googleUser.names?.filter((x) => x.metadata?.primary)[0]
        const email = googleUser.emailAddresses?.filter((x) => x.metadata?.primary)[0]
        const profile = googleUser.metadata?.sources?.filter(
            (x) => x.type?.toUpperCase() === 'PROFILE',
        )[0]
        const avatar = googleUser.photos?.filter((x) => x.metadata?.primary)[0]

        return {
            firstName: name?.givenName ?? '',
            lastName: name?.familyName ?? '',
            id: profile?.id ?? '',
            emailAddress: email?.value ?? '',
            accessToken: accessToken,
            avatar: avatar?.url ?? undefined,
        }
    }

    fillRemainingFields(user: User, socialUser: SocialUser): void {
        user.isGoogleAuth = true
        user.googleId = socialUser.id
    }
}
