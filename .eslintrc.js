module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: ['@folio/eslint-config-stripes'],
  globals: {
    process: true
  },
  rules: {
    'key-spacing': ['error', { 'beforeColon': false }],
    'import/no-extraneous-dependencies': 'off',
    'newline-before-return': 2,
    'newline-after-var': 2,
  },
  env: {
    'jest/globals': true
  },
  plugins: ['jest'],
};
