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
import Harness from '../../test/jest/helpers/Harness';

const renderMyProfile = () => {
  const stripes = buildStripes({
    hasPerm: jest.fn().mockReturnValue(true),
  });

  return render(
    <Harness>
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
    </Harness>
  );
};

describe('Given MyProfile', () => {
  afterEach(cleanup);

  it('should render', () => {
    const { getByText } = renderMyProfile();

    expect(getByText('ui-myprofile.settings.index.paneTitle')).toBeDefined();
  });
});
