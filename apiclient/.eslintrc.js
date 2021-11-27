module.exports = {
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
    },
    extends: ['../.eslintrc.js'],
    ignorePatterns: ['dist/', '.eslintrc.js', 'global-setup.js', 'jest.config.js'],
}
