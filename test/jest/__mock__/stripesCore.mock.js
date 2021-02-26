import React from 'react';

jest.mock('@folio/stripes/core', () => {
  const buildStripes = (otherProperties = {}) => ({
    actionNames: [],
    clone: buildStripes,
    connect: () => {},
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
    setLocale: () => {},
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

  const STRIPES = buildStripes({
    hasPerm: jest.fn().mockReturnValue(true),
  });

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

  STRIPES.connect = connect;

  return {
    ...jest.requireActual('@folio/stripes/core'),
    stripesConnect: connect,
    buildStripes,
  };
}, { virtual: true });
