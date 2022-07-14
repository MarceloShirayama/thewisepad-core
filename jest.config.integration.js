'use strict'

const jestConfig = require('./jest.config')

module.exports = {
  ...jestConfig,
  displayName: 'INTEGRATION',
  testMatch: ['<rootDir>/tests/integration/**/?(*.)+(spec|test).[tj]s?(x)']
}
