export function getPlayerFormatKey(value: number): string {
    switch (value) {
        case 1:
            return 'singles'
        case 2:
            return 'doubles'
        case 3:
            return 'trios'
        case 4:
            return 'fours'
        case 5:
            return 'fives'
        default:
            throw new Error('Unknown player count')
    }
}
