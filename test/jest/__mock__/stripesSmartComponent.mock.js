jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ConfigManager: jest.fn(({ children, lastMenu }) => (
    <div>
      ConfigManager
      {children}
      {lastMenu}
    </div>
  )),
}));
