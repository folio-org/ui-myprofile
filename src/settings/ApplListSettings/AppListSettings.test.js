import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useAppOrderContext } from '@folio/stripes/core';
import AppListSettings from './AppListSettings';
import {
  cleanup,
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { CalloutContextProvider } from '../../../test/jest/helpers/callout-context-provider';

const testOrderedNoPref = [
  {
    id: 'clickable-invoice-module',
    href: '/invoice',
    active: false,
    name: 'invoice',
    displayName: 'Invoices',
    route: '/invoice',
    queryResource: 'query',
    module: '@folio/invoice',
    description: 'Invoice',
    version: '6.1.1090000001259'
  },
  {
    id: 'clickable-agreements-module',
    href: '/erm/agreements',
    active: false,
    name: 'agreements',
    handlerName: 'eventHandler',
    displayName: 'Agreements',
    route: '/erm',
    home: '/erm/agreements',
    queryResource: 'query',
    module: '@folio/agreements',
    description: 'ERM agreement functionality for Stripes',
    version: '11.2.109900000000321'
  },
  {
    id: 'clickable-bulk-edit-module',
    href: '/bulk-edit',
    active: false,
    name: 'bulk-edit',
    displayName: 'Bulk edit',
    route: '/bulk-edit',
    home: '/bulk-edit',
    module: '@folio/bulk-edit',
    description: 'Description for bulk edit',
    version: '4.2.2090000003517'
  },
  {
    id: 'clickable-checkin-module',
    href: '/checkin',
    active: false,
    name: 'checkin',
    displayName: 'Check in',
    route: '/checkin',
    queryResource: 'query',
    module: '@folio/checkin',
    description: 'Item Check-in',
    version: '9.3.109000000926'
  },
  {
    displayName: 'stripes-core.settings',
    name: 'settings',
    id: 'clickable-settings',
    href: '/settings',
    active: false,
    description: 'FOLIO settings',
    iconData: {
      src: {},
      alt: 'Tenant Settings',
      title: 'Settings'
    },
    route: '/settings'
  }
];

const testPreference = [
  {
    name: 'invoice',
  },
  {
    name: 'agreements',
  },
  {
    name: 'bulk-edit',
  },
  {
    name: 'checkin',
  },
  {
    name: 'settings',
  }
];

const mockNewAppOrder = [{}];

const mockUpdateList = jest.fn();
const mockReset = jest.fn();
const mockUseAppOrderContext = jest.fn(() => ({
  apps: testOrderedNoPref,
  appNavOrder: testPreference,
  isLoading: false,
  updateList: mockUpdateList,
  reset: mockReset
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useAppOrderContext: jest.fn(() => mockUseAppOrderContext())
}));


jest.mock('./components/AppOrderList', () => ({ setItems }) => {
  return (
    <button
      type="button"
      onClick={() => setItems(mockNewAppOrder)}
    >
      testUpdatePrefs
    </button>
  );
});

const renderAppListSettings = () => {
  return (
    <CalloutContextProvider>
      <AppListSettings />
    </CalloutContextProvider>
  );
};

describe('AppListSettings', () => {
  let rendered;

  beforeEach(async () => {
    rendered = await render(renderAppListSettings());
  });

  afterEach(() => {
    cleanup();
  });

  it('renders', () => {
    expect(rendered.getByText('ui-myprofile.settings.appNavOrder.label')).toBeInTheDocument();
  });

  describe('saving the nav order preference', () => {
    beforeEach(async () => {
      await fireEvent.click(rendered.getByText('testUpdatePrefs'));
      await fireEvent.click(rendered.getByText('ui-myprofile.settings.appNavOrder.save'));
    });

    it('calls update if the save button is pressed', () => {
      expect(mockUpdateList).toHaveBeenCalledWith(mockNewAppOrder);
    });
  });

  describe('resetting the nav order preference', () => {
    beforeEach(async () => {
      await fireEvent.click(rendered.getByText('ui-myprofile.settings.appNavOrder.reset'));
    });

    it('calls update if the save button is pressed', () => {
      expect(mockReset).toHaveBeenCalledWith();
    });
  });
});
