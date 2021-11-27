import type { SocialProvider } from '@webowl/apiclient'
import type { User } from '../user/user.entity'

export type ISocialProvider = {
    provider: SocialProvider
    getSocialUser(accessToken: string): Promise<SocialUser>
    fillRemainingFields(user: User, socialUser: SocialUser): void
}

export type SocialUser = {
    lastName: string
    firstName: string
    id: string
    email: string
    accessToken: string
    avatar?: string
}
