import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.types.ts',
    '!src/**/*.test.ts',
    '!src/app.ts',
    '!src/server.ts'
  ],
  clearMocks: true
};

export default config;
