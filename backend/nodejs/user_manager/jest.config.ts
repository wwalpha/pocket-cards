import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
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

export default config;
