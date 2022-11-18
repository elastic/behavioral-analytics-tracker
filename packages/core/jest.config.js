module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 70000,
  resetMocks: true,
  setupFilesAfterEnv: ["<rootDir>/test/support.ts"],
};
