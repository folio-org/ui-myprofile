const path = require('path');
const config = require('@folio/jest-config-stripes');

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  // keyboardjs ships an untranspiled ESM source that @folio/stripes-components'
  // HotKeys imports directly; without this it fails with a syntax error under jest.
  transformIgnorePatterns: config.transformIgnorePatterns.map((pattern) => pattern.replace(
    '(?!@folio',
    '(?!keyboardjs|@folio',
  )),
};
