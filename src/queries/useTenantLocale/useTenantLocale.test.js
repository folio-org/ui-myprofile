import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';
import { useTenantLocale } from './useTenantLocale';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

useStripes.mockReturnValue(buildStripes({
  hasInterface: () => true,
}));

describe('useTenantLocale', () => {
  const mockLocaleData = {
    locale: 'en-US',
    numberingSystem: 'latn',
    timezone: 'America/New_York',
    currency: 'USD',
  };

  const kyMock = {
    get: jest.fn(),
    put: jest.fn(),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useNamespace.mockReturnValue(['tenantLocale']);

    kyMock.get.mockReturnValue({
      json: () => Promise.resolve(mockLocaleData),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when fetching tenant locale data', () => {
    it('should fetch data on mount', async () => {
      const { result } = renderHook(() => useTenantLocale(), { wrapper });

      await waitFor(() => expect(result.current.isLoadingTenantLocale).toBeFalsy());

      expect(kyMock.get).toHaveBeenCalledWith('locale');
      expect(result.current.tenantLocale).toEqual(mockLocaleData);
    });
  });
});
