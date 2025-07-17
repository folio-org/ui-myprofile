jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ConfigManager: jest.fn(({ lastMenu }) => (
    <div>
      ConfigManager
      {lastMenu}
    </div>
  )),
}));
