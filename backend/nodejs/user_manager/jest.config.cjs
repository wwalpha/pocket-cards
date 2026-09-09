module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2018' } }],
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@api': '<rootDir>/src/apis/index.ts',
    '@cognito': '<rootDir>/src/cognito.ts',
    '@utils': '<rootDir>/src/utils.ts',
    '@consts': '<rootDir>/src/consts.ts',
    '@queries': '<rootDir>/src/queries/index.ts',
  },
  setupFiles: ['dotenv/config'],
  forceExit: true,
  passWithNoTests: true,
  globalSetup: './test/configs/setup.ts',
  globalTeardown: './test/configs/teardown.ts',
};
