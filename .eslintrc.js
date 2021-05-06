module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'hackreactor',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-plusplus': [1, { allowForLoopAfterthoughts: true }],
    'no-console': 0,
    'import/no-extraneous-dependencies': [1, { devDependencies: true }],
    'import/extensions': 0,
    'default-param-last': ['error'],
  },
};
