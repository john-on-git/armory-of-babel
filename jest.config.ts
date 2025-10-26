module.exports = {
  roots: ["<rootDir>/tests/jest"],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: { '^\\$lib(.*)$': '<rootDir>/src/lib$1' }
};