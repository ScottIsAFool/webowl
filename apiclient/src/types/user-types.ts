export type User = {
    id: number
    emailAddress: string
    firstName: string
    lastName: string
    verified: boolean
    isFacebookAuth?: boolean
    isGoogleAuth?: boolean
    isMicrosoftAuth?: boolean
}

export type UserResponse = {
    user: User
}

export type UserEndpoints = ''
