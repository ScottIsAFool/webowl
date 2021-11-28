export function getFromStorage<T>(key: string): T | undefined {
    const json = localStorage.getItem(key) ?? undefined
    return json ? (JSON.parse(json) as T) : undefined
}

export function saveToStorage<T>(key: string, value: T): void {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
}

export function removeFromStorage(key: string): void {
    localStorage.removeItem(key)
}
