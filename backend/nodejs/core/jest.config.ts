import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
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
  coverageDirectory: 'coverage',
  setupFiles: ['./test/configs/setupMock.ts'],
  setupFilesAfterEnv: ['jest-extended'],
};

export default config;
