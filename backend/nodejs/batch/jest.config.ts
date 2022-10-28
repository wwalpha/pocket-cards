import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@utils': '<rootDir>/src/utils/index.ts',
    '@queries': '<rootDir>/src/queries/index.ts',
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/*': ['./test/*'],
  },
  globalSetup: './test/configs/setup.ts',
  globalTeardown: './test/configs/teardown.ts',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  setupFiles: ['./test/configs/setupMock.ts'],
  setupFilesAfterEnv: ['jest-extended'],
};

export default config;
