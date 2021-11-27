export type SocialProvider = 'Google' | 'Facebook' | 'Microsoft' /*| 'apple'*/

export type SocialAuthRequest = {
    accessToken: string
    socialId: string
    provider: SocialProvider
}
