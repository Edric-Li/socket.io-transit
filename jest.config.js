module.exports = {
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: [
    'app.dev.ts',
    'app.dev.js',
    'dev.ts',
    'dev.js',
    'ts',
    'js'
  ],
  moduleDirectories: [
    'node_modules',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    'dist'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$'
};
