export type User = {
    id: number
    emailAddress: string
    firstName: string
    lastName: string
    isFacebookAuth?: boolean
    isGoogleAuth?: boolean
    isMicrosoftAuth?: boolean
}

export type LoginRequest = {
    emailAddress: string
    password: string
}

export type RegisterRequest = {
    emailAddress: string
    firstName: string
    lastName: string
    password: string
}

export type VerifyRequest = {
    emailAddress: string
    verificationCode: string
}

export type AuthEndpoints = 'verify-email' | 'register' | 'login'
