export type User = {
    id: number
    emailAddress: string
    firstName: string
    lastName: string
    isFacebookAuth?: boolean
    isGoogleAuth?: boolean
    isMicrosoftAuth?: boolean
}
