module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  testURL: 'http://localhost',
  setupFilesAfterEnv: ['jest-enzyme', '<rootDir>/test/fetchMocks.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': __dirname + '/__mocks__/fileMock.js',
    '\\.(css|less)$': __dirname + '/__mocks__/styleMock.js'
  },
};
