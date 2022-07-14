'use strict'

module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
    '@unit-tests/(.*)': '<rootDir>/tests/unit/$1',
    '@integration-tests/(.*)': '<rootDir>/tests/integration/$1'
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/either.{ts,tsx}',
    '!<rootDir>/src/index.{ts,tsx}',
    '!<rootDir>/src/types/*.{ts,tsx}',
    '!<rootDir>/src/**/module-alias.{ts,tsx}'
  ]
}
