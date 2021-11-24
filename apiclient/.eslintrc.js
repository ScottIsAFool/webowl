module.exports = {
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
    },
    extends: ['../.eslintrc.js', '@doist/eslint-config/react'],
    ignorePatterns: ['dist/', '.eslintrc.js', 'global-setup.js', 'jest.config.js'],
}
