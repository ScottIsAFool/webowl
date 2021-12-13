function findPermutations<T>(array: T[]): T[][] {
    if (array.length < 2) {
        return [array]
    }

    const permutationsArray = []

    for (let i = 0; i < array.length; i++) {
        const element = [array[i]]

        const remainingObjects = [...array.slice(0, i), ...array.slice(i + 1, array.length)]

        for (const permutation of findPermutations(remainingObjects)) {
            permutationsArray.push(element.concat(permutation))
        }
    }
    return permutationsArray
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max))
}

function factorial(n: number): number {
    if (n === 1) {
        return n
    }
    return n * factorial(n - 1)
}

export { factorial, findPermutations, getRandomInt }
