export type Configuration = {
    port: number
    baseUrl: string
    corsRestrictions: string[]
    googleAPIKey: string
    jwtToken: string
    pushoverAppKey: string
    sentryDSN?: string
}

function validateWithMessage<T>(value: T | undefined, errorMessage: string): T | never {
    if (!value) {
        throw new Error(errorMessage)
    }
    return value
}

function validateEnv<T>(value: T | undefined, name: string): T | never {
    const message = `Environment variable ${name} was not found`
    return validateWithMessage(value, message)
}

export function getConfiguration(): Configuration {
    const {
        PORT,
        BASE_URL,
        CORS_RESTRICTIONS,
        GOOGLE_API_KEY,
        JWT_TOKEN,
        PUSHOVER_APP_KEY,
        SENTRY_DSN,
    } = process.env

    const jwtToken = validateEnv(JWT_TOKEN, 'JWT_TOKEN')
    const baseUrl = validateEnv(BASE_URL, 'BASE_URL')
    const pushoverAppKey = validateEnv(PUSHOVER_APP_KEY, 'PUSHOVER_APP_KEY')

    const sentryDSN = SENTRY_DSN

    return {
        port: PORT ? parseInt(PORT) : 3000,
        baseUrl,
        corsRestrictions: CORS_RESTRICTIONS?.split(',') ?? [],
        googleAPIKey: GOOGLE_API_KEY ?? '',
        jwtToken,
        pushoverAppKey,
        sentryDSN,
    }
}
