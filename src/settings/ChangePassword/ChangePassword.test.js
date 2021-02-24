import React from 'react';

import {
  cleanup,
  render,
} from '@testing-library/react';

import ChangePassword from './ChangePassword';

const changePasswordPostSpy = jest.fn();

const renderChangePassword = (props = {}) => render(
  <ChangePassword
    mutator={{
      changePassword: {
        POST: changePasswordPostSpy,
      },
    }}
    label={<span>Test label</span>}
    {...props}
  />
);

describe('Given ChangePassword', () => {
  afterEach(cleanup);

  describe('when component is rendered', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();
    });

    it('should have a current password field', () => {
      expect(component.getByText('Current password')).toBeDefined();
    });
  });
});
