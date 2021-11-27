import { Injectable } from '@nestjs/common'
import type { SocialProvider } from '@webowl/apiclient'
import { FacebookProvider } from './facebook.provider'
import { GoogleProvider } from './google.provider'
import { MicrosoftProvider } from './microsoft.provider'
import type { ISocialProvider } from './types'

@Injectable()
export class SocialAuthProvider {
    constructor(
        googleProvider: GoogleProvider,
        microsoftProvider: MicrosoftProvider,
        facebookProvider: FacebookProvider,
    ) {
        this.socialMap = [googleProvider, microsoftProvider, facebookProvider]
    }

    private readonly socialMap: ISocialProvider[]

    getSocialProvider(provider: SocialProvider): ISocialProvider {
        return this.socialMap.find((x) => x.provider === provider) as ISocialProvider
    }
}
