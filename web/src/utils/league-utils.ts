export function playerFormat(value: number): string {
    switch (value) {
        case 1:
            return 'Singles'
        case 2:
            return 'Doubles'
        case 3:
            return 'Trios'
        case 4:
            return 'Fours'
        case 5:
            return 'Fives'
        default:
            throw new Error('Unknown player count')
    }
}
