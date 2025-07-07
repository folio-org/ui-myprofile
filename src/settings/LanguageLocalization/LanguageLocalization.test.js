import { act } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  useSettings,
  useStripes,
  userOwnLocaleConfig,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import LanguageLocalization from './LanguageLocalization';
import Harness from '../../../test/jest/helpers/Harness';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

const tenantSettings = {
  locale: 'en-US',
  numberingSystem: 'latn',
  currency: 'USD',
  timezone: 'UTC',
};

const userSettings = {
  locale: 'en-GB',
};

const mockSetLocale = jest.fn();

const stripes = buildStripes({
  setLocale: mockSetLocale,
});

const renderLanguageLocalization = (props = {}) => render(
  <Harness>
    <Form
      onSubmit={() => {}}
      mutators={arrayMutators}
      initialValues={{}}
      render={formProps => (
        <LanguageLocalization
          {...props}
          {...formProps}
        />
      )}
    />
  </Harness>
);

describe('LanguageLocalization', () => {
  const mockUpdateSetting = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useSettings.mockImplementation(({ scope }) => {
      if (scope === userOwnLocaleConfig.SCOPE) {
        return {
          settings: userSettings,
          isLoading: false,
          updateSetting: mockUpdateSetting,
        };
      }

      return {
        settings: tenantSettings,
        isLoading: false,
        updateSetting: mockUpdateSetting,
      };
    });

    useStripes.mockReturnValue(stripes);
  });

  it('should call ConfigManager with userId and other expected props', () => {
    renderLanguageLocalization();

    expect(ConfigManager).toHaveBeenCalledWith(expect.objectContaining({
      formType: 'final-form',
      label: 'ui-myprofile.settings.languageLocalization.label',
      scope: 'user-locale-scope',
      configName: 'user-locale-key',
      userId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    }), {});
  });

  describe('when there is a locale in user settings', () => {
    it('should display the user locale', async () => {
      renderLanguageLocalization();

      const initialValues = await act(() => ConfigManager.mock.calls[0][0].getInitialValues());

      expect(initialValues).toEqual({
        locale: 'en-GB',
      });
    });
  });

  describe('when there is no locale in user settings, but it is present in tenant settings', () => {
    beforeEach(() => {
      useSettings.mockImplementation(({ scope }) => {
        if (scope === userOwnLocaleConfig) {
          return {
            settings: {},
            isLoading: false,
          };
        }

        return {
          settings: tenantSettings,
          isLoading: false,
        };
      });
    });

    it('should display the tenant locale', async () => {
      renderLanguageLocalization();

      const initialValues = await act(() => ConfigManager.mock.calls[0][0].getInitialValues());

      expect(initialValues).toEqual({
        locale: 'en-US',
      });
    });
  });

  it('should save both initial and new settings', async () => {
    const newUserSettings = {
      locale: 'en-SE',
    };

    renderLanguageLocalization();

    await act(() => ConfigManager.mock.calls[0][0].getInitialValues());

    const payload = ConfigManager.mock.calls.at(-1)[0].onBeforeSave(newUserSettings);

    expect(payload).toEqual({
      ...userSettings,
      ...newUserSettings,
    });
  });

  describe('when user selects the locale that matches tenant locale', () => {
    it('should apply tenant locale', async () => {
      renderLanguageLocalization();

      ConfigManager.mock.calls[0][0].onAfterSave({
        value: tenantSettings,
      });

      expect(mockSetLocale).toHaveBeenCalledWith('en-US-u-nu-latn');
    });
  });

  describe('when user selects the locale that does not match the tenant locale', () => {
    it('should apply user locale', () => {
      renderLanguageLocalization();

      ConfigManager.mock.calls[0][0].onAfterSave({
        value: userSettings,
      });

      expect(mockSetLocale).toHaveBeenCalledWith('en-GB-u-nu-latn');
    });
  });

  describe('when user clicks on "Reset to default" button', () => {
    it('should apply clear user preferences and apply tenant locale', async () => {
      renderLanguageLocalization();

      const resetToDefaultButton = screen.getByRole('button', { name: 'ui-myprofile.settings.languageLocalization.resetToDefault' });

      fireEvent.click(resetToDefaultButton);

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        scope: userOwnLocaleConfig.SCOPE,
        key: userOwnLocaleConfig.KEY,
        locale: null,
      });
      waitFor(() => expect(mockSetLocale).toHaveBeenCalledWith('en-US-u-nu-latn'));
    });
  });
});
