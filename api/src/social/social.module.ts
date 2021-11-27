import { Module } from '@nestjs/common'
import { FacebookProvider } from './facebook.provider'
import { GoogleProvider } from './google.provider'
import { MicrosoftProvider } from './microsoft.provider'
import { SocialAuthProvider } from './social-provider.service'

@Module({
    providers: [FacebookProvider, GoogleProvider, MicrosoftProvider, SocialAuthProvider],
    exports: [SocialAuthProvider],
})
export class SocialModule {}
