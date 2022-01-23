module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
