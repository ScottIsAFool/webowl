import type { TlsOptions } from 'tls'
import type { EncryptionOptions } from 'typeorm-encrypted'

export type Configuration = {
    port: number
    baseUrl: string
    baseWebUrl: string
    corsRestrictions: string[]
    googleAPIKey: string
    jwtToken: string
    sentryDSN?: string
    database: DatabaseConfiguration
    expiryTime: number
    emailServiceKey: string
}

type DatabaseConfiguration = {
    url: string
    ssl: boolean | TlsOptions
    encryption: EncryptionOptions
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
        BASE_WEB_URL,
        CORS_RESTRICTIONS,
        GOOGLE_API_KEY,
        JWT_TOKEN,
        SENTRY_DSN,
        DATABASE_URL,
        DB_SSL,
        DB_ENCRYPTION_KEY,
        DB_ENCRYPTION_ALGORITHM,
        DB_ENCRYPTION_IV_LENGTH,
        EXPIRY_TIME,
        SEND_GRID_KEY,
    } = process.env

    const jwtToken = validateEnv(JWT_TOKEN, 'JWT_TOKEN')
    const baseUrl = validateEnv(BASE_URL, 'BASE_URL')
    const baseWebUrl = validateEnv(BASE_WEB_URL, 'BASE_WEB_URL')

    const sentryDSN = SENTRY_DSN

    const encryptionKey = validateEnv(DB_ENCRYPTION_KEY, 'DB_ENCRYPTION_KEY')
    const algorithm = validateEnv(DB_ENCRYPTION_ALGORITHM, 'DB_ENCRYPTION_ALGORITHM')
    const encryptionLength = validateEnv(DB_ENCRYPTION_IV_LENGTH, 'DB_ENCRYPTION_IV_LENGTH')
    const dbUrl = validateEnv(DATABASE_URL, 'DATABASE_URL')
    const ssl = validateEnv(DB_SSL, 'DB_SSL')
    const expiryTime = validateEnv(EXPIRY_TIME, 'EXPIRY_TIME')
    const emailServiceKey = validateEnv(SEND_GRID_KEY, 'SEND_GRID_KEY')

    const googleAPIKey = validateEnv(GOOGLE_API_KEY, 'GOOGLE_API_KEY')

    const tlsOptions: boolean | TlsOptions =
        ssl === 'true'
            ? {
                  rejectUnauthorized: false,
              }
            : false

    return {
        port: PORT ? parseInt(PORT) : 3000,
        baseUrl,
        baseWebUrl,
        corsRestrictions: CORS_RESTRICTIONS?.split(',') ?? [],
        jwtToken,
        sentryDSN,
        expiryTime: parseInt(expiryTime),
        googleAPIKey,
        emailServiceKey,
        database: {
            url: dbUrl,
            ssl: tlsOptions,
            encryption: {
                key: encryptionKey,
                algorithm,
                ivLength: Number(encryptionLength),
            },
        },
    }
}
