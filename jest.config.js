const { join } = require('path')

module.exports = {
    transform: { '^.+\\.(ts|tsx)?$': 'ts-jest' },
    clearMocks: true,
    testEnvironment: 'jsdom',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['node_modules/(?!@shotgunjed)/'],
    // moduleNameMapper: {
    //     '\\.(css|less|scss|png|jpg)$': '<rootDir>/test/resourcesMock.ts',
    // },
    globalSetup: join(__dirname, 'global-setup.js'),
}
