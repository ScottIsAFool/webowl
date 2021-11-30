export type User = {
    id: number
    emailAddress: string
    firstName: string
    lastName: string
    verified: boolean
    isFacebookAuth?: boolean
    isGoogleAuth?: boolean
    isMicrosoftAuth?: boolean
    defaultLeagueId?: number
}

export type UserResponse = {
    user: User
}

export type UserEndpoints = ''
