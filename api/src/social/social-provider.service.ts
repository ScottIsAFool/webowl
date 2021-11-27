import { Injectable } from '@nestjs/common'
import type { SocialProvider } from '@webowl/apiclient'
import { FacebookProvider } from './facebook.provider'
import { GoogleProvider } from './google.provider'
import { MicrosoftProvider } from './microsoft.provider'
import type { SocialMap, ISocialProvider } from './types'

@Injectable()
export class SocialAuthProvider {
    constructor(
        googleProvider: GoogleProvider,
        microsoftProvider: MicrosoftProvider,
        facebookProvider: FacebookProvider,
    ) {
        this._socialMap = {
            Facebook: facebookProvider,
            Google: googleProvider,
            Microsoft: microsoftProvider,
        }
    }

    private readonly _socialMap: SocialMap

    getSocialProvider(provider: SocialProvider): ISocialProvider {
        return this._socialMap[provider]
    }
}
