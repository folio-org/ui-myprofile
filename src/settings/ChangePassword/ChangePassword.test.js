import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { MemoryRouter } from 'react-router-dom';
import {
  cleanup,
  render,
  fireEvent,
} from '@testing-library/react';

import { stripesConnect } from '@folio/stripes/core';

import ChangePassword from './ChangePassword';
import { CalloutContextProvider } from '../../../test/jest/helpers/callout-context-provider';

const changePasswordPostSpy = jest.fn();

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

let store = createStore(reducer);

const renderChangePassword = (props = {}) => {
  const ChangePasswordWithStripes = stripesConnect(ChangePassword);

  return render(
    <CalloutContextProvider>
      <Provider store={store}>
        <MemoryRouter>
          <ChangePasswordWithStripes
            mutator={{
              changePassword: {
                POST: changePasswordPostSpy,
              },
            }}
            label={<span>Test label</span>}
            {...props}
          />
        </MemoryRouter>
      </Provider>
    </CalloutContextProvider>
  );
};

describe('Given ChangePassword', () => {
  afterEach(() => {
    cleanup();
    store = createStore(reducer);
  });

  describe('when component is rendered', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();
    });

    it('should have a current password field', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.currentPassword')).toBeDefined();
    });

    it('should have a new password field', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.newPassword')).toBeDefined();
    });

    it('should have a confirm password field', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.confirmPassword')).toBeDefined();
    });

    it('should have a show/hide button', () => {
      expect(component.getByTestId('change-password-toggle-mask-btn')).toBeDefined();
    });

    it('displays correct toggle button text', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.showPassword')).toBeDefined();
    });

    it('sets the type of the form fields to password', () => {
      expect(component.getByTestId('current-password-field').type).toEqual('password');
      expect(component.getByTestId('new-password-field').type).toEqual('password');
      expect(component.getByTestId('confirm-password-field').type).toEqual('password');
    });
  });

  describe('when toggling mask password', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();

      fireEvent.click(component.getByTestId('change-password-toggle-mask-btn'));
    });

    it('changes toggle button text', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.hidePassword')).toBeDefined();
    });

    it('changes the type of the form fields to text', () => {
      expect(component.getByTestId('current-password-field').type).toEqual('text');
      expect(component.getByTestId('new-password-field').type).toEqual('text');
      expect(component.getByTestId('confirm-password-field').type).toEqual('text');
    });
  });

  describe('validating current password', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();
      const field = component.getByTestId('current-password-field');

      fireEvent.change(field, { target: { value: 'a' } });
      fireEvent.change(field, { target: { value: '' } });
      fireEvent.blur(field);
    });

    it('should display a validation error message', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.enterValue')).toBeDefined();
    });
  });

  describe('validating new password', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();
      const field = component.getByTestId('new-password-field');

      fireEvent.change(field, { target: { value: 'a' } });
      fireEvent.change(field, { target: { value: '' } });
      fireEvent.blur(field);
    });

    it('should display a validation error message', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.enterValue')).toBeDefined();
    });
  });

  describe('validating confirm password', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();
      const field = component.getByTestId('confirm-password-field');

      fireEvent.change(field, { target: { value: 'a' } });
      fireEvent.change(field, { target: { value: '' } });
      fireEvent.blur(field);
    });

    it('should display a validation error message', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.enterValue')).toBeDefined();
    });
  });

  describe('validating new and confirm password fails', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();

      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');

      fireEvent.change(newPasswordField, { target: { value: 'a' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'aa' } });
      fireEvent.blur(confirmPasswordField);
    });

    it('should display a validation error message', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.confirmPasswordMatchError')).toBeDefined();
    });
  });

  describe('validating new and confirm password pass', () => {
    let component;

    beforeEach(() => {
      component = renderChangePassword();

      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');

      fireEvent.change(newPasswordField, { target: { value: 'a' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'a' } });
      fireEvent.blur(confirmPasswordField);
    });

    it('should not display a validation error message', () => {
      expect(component.queryByText('ui-myprofile.settings.changePassword.confirmPasswordMatchError')).toBeNull();
    });
  });

  describe('submitting the form', () => {
    let component;

    beforeEach(() => {
      changePasswordPostSpy.mockResolvedValue();
      component = renderChangePassword();

      const currentPasswordField = component.getByTestId('current-password-field');
      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');
      const submitButton = component.getByText('ui-myprofile.settings.changePassword.save');

      fireEvent.change(currentPasswordField, { target: { value: 'current' } });
      fireEvent.change(newPasswordField, { target: { value: 'new' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'new' } });
      fireEvent.click(submitButton);
    });

    it('all fields should be reset upon successful submit', () => {
      expect(component.getByTestId('current-password-field').value).toEqual('');
      expect(component.getByTestId('new-password-field').value).toEqual('');
      expect(component.getByTestId('confirm-password-field').value).toEqual('');
    });

    it('success message should be shown upon successful submit', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.successfullyChanged')).toBeDefined();
    });
  });

  describe('submitting the form with incorrect current password', () => {
    let component;

    beforeEach(async () => {
      changePasswordPostSpy.mockRejectedValue({
        status: 401,
      });
      component = renderChangePassword();

      const currentPasswordField = component.getByTestId('current-password-field');
      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');
      const submitButton = component.getByText('ui-myprofile.settings.changePassword.save');

      fireEvent.change(currentPasswordField, { target: { value: 'wrong-current' } });
      fireEvent.change(newPasswordField, { target: { value: 'new' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'new' } });
      fireEvent.click(submitButton);

      // wait for error message
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    it('all fields should not be reset upon failed submit', () => {
      expect(component.getByTestId('current-password-field').value).toEqual('wrong-current');
      expect(component.getByTestId('new-password-field').value).toEqual('new');
      expect(component.getByTestId('confirm-password-field').value).toEqual('new');
    });

    it('validation error message should be shown upon failed submit', () => {
      expect(component.getByText('ui-myprofile.settings.changePassword.wrongPassword')).toBeDefined();
    });
  });

  describe('submitting the form and receiving a server error', () => {
    let component;

    beforeEach(async () => {
      changePasswordPostSpy.mockRejectedValue({
        status: 500,
      });
      component = renderChangePassword();

      const currentPasswordField = component.getByTestId('current-password-field');
      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');
      const submitButton = component.getByText('ui-myprofile.settings.changePassword.save');

      fireEvent.change(currentPasswordField, { target: { value: 'current' } });
      fireEvent.change(newPasswordField, { target: { value: 'new' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'new' } });
      fireEvent.click(submitButton);

      // wait for error message
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('all fields should be reset upon failed submit', () => {
      expect(component.getByTestId('current-password-field').value).toEqual('');
      expect(component.getByTestId('new-password-field').value).toEqual('');
      expect(component.getByTestId('confirm-password-field').value).toEqual('');
    });
  });

  describe('submitting the form with incorrect new password, last ten passwords error', () => {
    let component;

    beforeEach(async () => {
      changePasswordPostSpy.mockRejectedValue({
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [{
            code: 'last-ten-passwords-error',
          }],
        }),
      });
      component = renderChangePassword();

      const currentPasswordField = component.getByTestId('current-password-field');
      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');
      const submitButton = component.getByText('ui-myprofile.settings.changePassword.save');

      fireEvent.change(currentPasswordField, { target: { value: 'current' } });
      fireEvent.change(newPasswordField, { target: { value: 'last-ten-passwords' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'last-ten-passwords' } });
      fireEvent.click(submitButton);

      // wait for error message
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('all fields should not be reset upon failed submit', () => {
      expect(component.getByTestId('current-password-field').value).toEqual('current');
      expect(component.getByTestId('new-password-field').value).toEqual('last-ten-passwords');
      expect(component.getByTestId('confirm-password-field').value).toEqual('last-ten-passwords');
    });

    it('validation error message should be shown upon failed submit', () => {
      expect(component.getByText(/last-ten-passwords-error/)).toBeDefined();
    });
  });

  describe('submitting the form and multiple errors are received', () => {
    let component;

    beforeEach(async () => {
      changePasswordPostSpy.mockRejectedValue({
        status: 400,
        json: jest.fn().mockResolvedValue({
          errors: [{
            code: 'error-1',
          }, {
            code: 'error-2',
          }],
        }),
      });
      component = renderChangePassword();

      const currentPasswordField = component.getByTestId('current-password-field');
      const newPasswordField = component.getByTestId('new-password-field');
      const confirmPasswordField = component.getByTestId('confirm-password-field');
      const submitButton = component.getByText('ui-myprofile.settings.changePassword.save');

      fireEvent.change(currentPasswordField, { target: { value: 'current' } });
      fireEvent.change(newPasswordField, { target: { value: 'password' } });
      fireEvent.change(confirmPasswordField, { target: { value: 'password' } });
      fireEvent.click(submitButton);

      // wait for error message
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('all fields should not be reset upon failed submit', () => {
      expect(component.getByTestId('current-password-field').value).toEqual('current');
      expect(component.getByTestId('new-password-field').value).toEqual('password');
      expect(component.getByTestId('confirm-password-field').value).toEqual('password');
    });

    it('validation error messages should be shown upon failed submit', () => {
      expect(component.getByText(/error-1/)).toBeDefined();
      expect(component.getByText(/error-2/)).toBeDefined();
    });
  });
});
