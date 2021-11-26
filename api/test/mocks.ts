export function mockConnection(): Record<string, unknown> {
    return {
        getRepository: jest.fn(),
    }
}
