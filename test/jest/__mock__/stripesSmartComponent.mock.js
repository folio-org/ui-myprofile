jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ConfigManager: jest.fn(() => <div>ConfigManager</div>),
}));
