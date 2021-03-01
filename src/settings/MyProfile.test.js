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
import MyProfile from './MyProfile';

const renderMyProfile = () => {
  const stripes = buildStripes({
    hasPerm: jest.fn().mockReturnValue(true),
  });

  return render(
    <MemoryRouter>
      <Route
        component={props => (
          <MyProfile
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

describe('Given MyProfile', () => {
  afterEach(cleanup);

  it('should render', () => {
    const { getByText } = renderMyProfile();

    expect(getByText('ui-myprofile.settings.index.paneTitle')).toBeDefined();
  });
});
