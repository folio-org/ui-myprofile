module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['@folio/eslint-config-stripes'],
  rules: {
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
  },
  env: {
    'jest/globals': true
  },
  plugins: ['jest'],
};
