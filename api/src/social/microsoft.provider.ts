import { Injectable } from '@nestjs/common'
import type { SocialProvider } from '@webowl/apiclient'
import type { User } from '../user/user.entity'
import type { ISocialProvider, SocialUser } from './types'
import {
    AuthenticationProvider,
    AuthenticationProviderOptions,
    Client,
} from '@microsoft/microsoft-graph-client'

type MicrosoftUser = {
    surname: string
    givenName: string
    id: string
    userPrincipalName: string
}

class WebowlMicrosoftAuthProvider implements AuthenticationProvider {
    constructor(private accessToken: string) {}
    getAccessToken(
        _authenticationProviderOptions?: AuthenticationProviderOptions,
    ): Promise<string> {
        return Promise.resolve(this.accessToken)
    }
}

@Injectable()
export class MicrosoftProvider implements ISocialProvider {
    readonly provider: SocialProvider = 'Microsoft'
    async getSocialUser(accessToken: string): Promise<SocialUser> {
        const client = this.getClient(accessToken)

        const response = (await client
            .api('/me')
            .select(['surname', 'givenName', 'id', 'userPrincipalName'])
            .get()) as MicrosoftUser

        return {
            accessToken: accessToken,
            firstName: response.givenName,
            lastName: response.surname,
            id: response.id,
            emailAddress: response.userPrincipalName,
        }
    }

    fillRemainingFields(user: User, socialUser: SocialUser): void {
        user.microsoftId = socialUser.id
        user.isMicrosoftAuth = true
    }

    private getClient(accessToken: string): Client {
        return Client.initWithMiddleware({
            authProvider: new WebowlMicrosoftAuthProvider(accessToken),
        })
    }
}
