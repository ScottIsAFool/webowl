import dayjs from 'dayjs'

export function hasAuthTokenExpired(expiryDate?: Date): boolean {
    if (expiryDate === undefined) {
        return false
    }

    const now = dayjs()
    const expDate = dayjs(expiryDate)

    return now > expDate
}
