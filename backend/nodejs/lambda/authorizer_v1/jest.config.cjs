module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2018' } }],
  },
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  forceExit: true,
  passWithNoTests: true,
  globalSetup: './test/configs/setup.ts',
};
