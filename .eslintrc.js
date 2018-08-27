module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['@folio/eslint-config-stripes'],
  globals: {
    process: true
  },
  rules: {
    "import/no-extraneous-dependencies": "off",
  }
};
