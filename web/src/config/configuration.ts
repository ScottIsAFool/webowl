type Configuration = {
    baseUrl: string
    googleClientId: string
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
    const { REACT_APP_API_URL, REACT_APP_GOOGLE_CLIENT_ID } = process.env

    const baseUrl = validateEnv(REACT_APP_API_URL, 'REACT_APP_API_URL')
    const googleClientId = validateEnv(REACT_APP_GOOGLE_CLIENT_ID, 'REACT_APP_GOOGLE_CLIENT_ID')

    return { baseUrl, googleClientId }
}
