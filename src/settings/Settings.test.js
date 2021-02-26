import React from 'react';
import {
  MemoryRouter,
  Route,
} from 'react-router-dom';
import {
  cleanup,
  render,
} from '@testing-library/react';

import { buildStripes } from '@folio/stripes/core';
import Settings from './Settings';

const renderSettings = () => {
  const stripes = buildStripes({
    hasPerm: jest.fn().mockReturnValue(true),
  });

  return render(
    <MemoryRouter>
      <Route
        component={props => (
          <Settings
            stripes={stripes}
            showSettings
            actAs="settings"
            {...props}
          />
        )}
        path="*"
      />
    </MemoryRouter>
  );
};

describe('Given Settings', () => {
  afterEach(cleanup);

  it('should render', () => {
    const { getByText } = renderSettings();

    expect(getByText('ui-myprofile.settings.index.paneTitle')).toBeDefined();
  });
});
