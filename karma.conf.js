module.exports = (config) => {
  const testIndex = './bigtest/index.js';
  const preprocessors = {};

  preprocessors[`${testIndex}`] = ['webpack'];

  const configuration = {
    files: [
      { pattern: testIndex, watched: false },
    ],
    preprocessors,
    browserDisconnectTimeout: 10e5,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 10e5,
    captureTimeout: 10e5,
  };

  // Set output directory for junit reporter
  if (config.junitReporter) {
    configuration.junitReporter = {
      outputDir: 'artifacts/junit/Karma'
    };
  }

  // Todo: Add coverage report thresholds

  config.set(configuration);
};
