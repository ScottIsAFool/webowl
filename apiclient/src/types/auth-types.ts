type WithEmail = {
    emailAddress: string
}

export type User = {
    id: number
    emailAddress: string
    firstName: string
    lastName: string
    isFacebookAuth?: boolean
    isGoogleAuth?: boolean
    isMicrosoftAuth?: boolean
}

export type LoginRequest = WithEmail & {
    password: string
}

export type LoginResponse = {
    user: User
    authToken: AuthToken
}

export type RegisterRequest = {
    emailAddress: string
    firstName: string
    lastName: string
    password: string
}

export type VerifyRequest = WithEmail & {
    verificationCode: string
}

export type ResendVerificationRequest = WithEmail

export type ChangePasswordRequest = {
    oldPassword: string
    newPassword: string
}

export type SendPasswordResetRequest = WithEmail

export type PasswordResetRequest = WithEmail & {
    code: string
    password: string
}

export type RefreshTokenRequest = {
    refreshToken: string
}

export type AuthEndpoints =
    | 'verify-email'
    | 'register'
    | 'login'
    | 'resend-verification'
    | 'change-password'
    | 'password-reset'
    | 'send-password-reset'
    | 'refresh'
    | 'logout'
    | 'social'

export type AuthToken = {
    accessToken: string
    expiresAt: number
    refreshToken: string
}
