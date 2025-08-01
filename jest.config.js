module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '^@picovoice/porcupine-web$': '<rootDir>/__mocks__/porcupine-web.js',
    '^@picovoice/web-voice-processor$': '<rootDir>/__mocks__/web-voice-processor.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/src/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.json',
      useESM: false
    }
  }
}; 