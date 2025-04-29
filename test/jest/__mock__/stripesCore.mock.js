import React from 'react';

const buildStripes = (otherProperties = {}) => ({
  actionNames: [],
  clone: buildStripes,
  connect: Comp => Comp,
  config: {},
  currency: 'USD',
  hasInterface: () => true,
  hasPerm: () => {},
  locale: 'en-US',
  logger: {
    log: () => {},
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => {},
  setCurrency: () => {},
  setLocale: jest.fn(),
  setSinglePlugin: () => {},
  setTimezone: () => {},
  setToken: () => {},
  store: {
    getState: () => {},
    dispatch: () => {},
    subscribe: () => {},
    replaceReducer: () => {},
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
    },
  },
  withOkapi: true,
  ...otherProperties,
});

jest.mock('@folio/stripes/core', () => {
  const STRIPES = buildStripes();

  const connect = Component => ({ mutator, resources, stripes, ...rest }) => {
    const fakeMutator = mutator || Object.keys(Component.manifest).reduce((acc, mutatorName) => {
      const returnValue = Component.manifest[mutatorName].records ? [] : {};

      acc[mutatorName] = {
        GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
        PUT: jest.fn().mockReturnValue(Promise.resolve()),
        POST: jest.fn().mockReturnValue(Promise.resolve()),
        DELETE: jest.fn().mockReturnValue(Promise.resolve()),
        reset: jest.fn(),
      };

      return acc;
    }, {});

    const fakeResources = resources || Object.keys(Component.manifest).reduce((acc, resourceName) => {
      acc[resourceName] = {
        records: [],
      };

      return acc;
    }, {});

    const fakeStripes = stripes || STRIPES;

    return <Component {...rest} mutator={fakeMutator} resources={fakeResources} stripes={fakeStripes} />;
  };

  // eslint-disable-next-line react/prop-types
  const withStripes = (Component) => ({ stripes, ...rest }) => {
    const fakeStripes = stripes || STRIPES;

    return <Component {...rest} stripes={fakeStripes} />;
  };

  STRIPES.connect = connect;

  // eslint-disable-next-line react/prop-types
  const TitleManager = (props) => <>{props.children}</>;

  const userOwnLocaleConfig = {
    SCOPE: 'user-locale-scope',
    KEY: 'user-locale-key',
  };

  const tenantLocaleConfig = {
    SCOPE: 'tenant-locale-scope',
    KEY: 'tenant-locale-key',
  };

  const usePreferences = jest.fn(() => ({
    getPreference: jest.fn(),
    setPreference: jest.fn(),
    removePreference: jest.fn(),
  }));

  const useTenantPreferences = jest.fn(() => ({
    getTenantPreference: jest.fn(),
    setTenantPreference: jest.fn(),
    removeTenantPreference: jest.fn(),
  }));

  return {
    ...jest.requireActual('@folio/stripes/core'),
    stripesConnect: connect,
    buildStripes,
    withStripes,
    TitleManager,
    userOwnLocaleConfig,
    tenantLocaleConfig,
    useStripes: jest.fn(() => STRIPES),
    getFullLocale: jest.fn(),
    useTenantPreferences,
    usePreferences,
  };
}, { virtual: true });

export default buildStripes;
