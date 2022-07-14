'use strict'

const jestConfig = require('./jest.config')

module.exports = {
  ...jestConfig,
  displayName: 'UNIT',
  testMatch: ['<rootDir>/tests/unit/**/?(*.)+(spec|test).[tj]s?(x)']
}
