import { render, renderHook, screen } from '@testing-library/react';

import { useModules, useStripes } from '@folio/stripes/core';
import { connectFor } from '@folio/stripes/connect';

import useApplicationSettings from './useApplicationSettings';

jest.mock('@folio/stripes/core', () => ({
  useModules: jest.fn(),
  useStripes: jest.fn(),
  AppIcon: ({ children }) => <span>{children}</span>, // eslint-disable-line react/prop-types
}));

jest.mock('@folio/stripes/connect', () => ({
  connectFor: jest.fn(),
}));

const makeModule = (name, displayName, route) => ({
  module: `@folio/${name}`,
  displayName,
  route,
  getModule: jest.fn(() => function Mod(props) { // eslint-disable-line prefer-arrow-callback
    return <div>{`${name} showMyprofile=${String(props.showMyprofile)} stripes=${props.stripes.tag}`}</div>; // eslint-disable-line react/prop-types
  }),
});

describe('useApplicationSettings', () => {
  const moduleStripes = { tag: 'moduleStripes' };
  let stripes;

  beforeEach(() => {
    stripes = {
      hasPerm: jest.fn(() => true),
      epics: {},
      logger: {},
      clone: jest.fn(() => moduleStripes),
    };
    useStripes.mockReturnValue(stripes);
    connectFor.mockReturnValue(C => C);
  });

  it('returns an empty array when there are no myprofile modules', () => {
    useModules.mockReturnValue({});
    const { result } = renderHook(() => useApplicationSettings());
    expect(result.current).toEqual([]);
  });

  it('filters out modules lacking the settings.<name>.enabled permission', () => {
    useModules.mockReturnValue({
      myprofile: [makeModule('alpha', 'Alpha', '/alpha'), makeModule('beta', 'Beta', '/beta')],
    });
    stripes.hasPerm.mockImplementation(p => p === 'settings.beta.enabled');

    const { result } = renderHook(() => useApplicationSettings());

    expect(stripes.hasPerm).toHaveBeenCalledWith('settings.alpha.enabled');
    expect(result.current.map(p => p.route)).toEqual(['beta']);
  });

  it('sorts case-insensitively by displayName and strips leading slashes from routes', () => {
    useModules.mockReturnValue({
      myprofile: [
        makeModule('c', 'charlie', '/c'),
        makeModule('a', 'Alpha', '/a'),
        makeModule('b', 'bravo', 'b'),
      ],
    });

    const { result } = renderHook(() => useApplicationSettings());

    expect(result.current.map(p => p.route)).toEqual(['a', 'b', 'c']);
  });

  it('provides a label and a component that passes showMyprofile and module stripes', () => {
    useModules.mockReturnValue({ myprofile: [makeModule('alpha', 'Alpha', '/alpha')] });

    const { result } = renderHook(() => useApplicationSettings());
    const [{ label, component: Delegate }] = result.current;

    expect(connectFor).toHaveBeenCalledWith('@folio/alpha', stripes.epics, stripes.logger);
    expect(stripes.clone).toHaveBeenCalledWith({ connect: expect.any(Function) });

    render(<>{label}<Delegate /></>);
    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.getByText('alpha showMyprofile=true stripes=moduleStripes')).toBeDefined();
  });

  it('traps errors when a module fails to load and logs an error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const bad = makeModule('bad', 'Bad', '/bad');
    bad.getModule.mockImplementation(() => { throw new Error('boom'); });
    useModules.mockReturnValue({ myprofile: [bad] });

    renderHook(() => useApplicationSettings());
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
