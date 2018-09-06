module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['@folio/eslint-config-stripes'],
  globals: {
    process: true
  },
  rules: {
    "import/no-extraneous-dependencies": "off",
    "newline-before-return" : 2,
    "newline-after-var" : 2,
  }
};
