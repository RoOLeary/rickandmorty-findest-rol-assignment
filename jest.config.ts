module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest', // Add this to use Babel for transforming JS/ESM files
    },
    transformIgnorePatterns: [
      '/node_modules/(?!ky/)', // Tell Jest to transform 'ky'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'], // If you have a test setup file for jest-dom
   
    moduleNameMapper: {
        '^ky$': '<rootDir>/mocks/kyMock.ts', // This file would mock ky
    },
    "verbose": true
    
  };
  
