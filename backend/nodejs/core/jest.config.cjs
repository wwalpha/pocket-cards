module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2018' } }],
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@queries': '<rootDir>/src/queries/index.ts',
    '@consts': '<rootDir>/src/consts/index.ts',
    '@services': '<rootDir>/src/services/index.ts',
    '@utils': '<rootDir>/src/utils/index.ts',
    'test/(.*)': '<rootDir>/test/$1',
  },
  globalSetup: './test/configs/setup.ts',
  globalTeardown: './test/configs/teardown.ts',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  setupFiles: ['./test/configs/setupMock.ts'],
  setupFilesAfterEnv: ['jest-extended'],
};
