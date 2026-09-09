module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2018' } }],
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1',
  },
  globalSetup: './test/configs/setup.ts',
  globalTeardown: './test/configs/teardown.ts',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFiles: ['./test/configs/setupMock.ts'],
};
