import { act } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  useStripes,
  getFullLocale,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import { useSettings } from '../../queries';
import LanguageLocalization from './LanguageLocalization';
import Harness from '../../../test/jest/helpers/Harness';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

jest.mock('../../queries', () => ({
  ...jest.requireActual('../../queries'),
  useSettings: jest.fn(),
}));

const tenantSettings = {
  locale: 'en-US',
  numberingSystem: 'latn',
  currency: 'USD',
  timezone: 'UTC',
};

const userSettings = {
  locale: 'en-GB',
  currency: 'TRY',
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
  beforeEach(() => {
    jest.clearAllMocks();

    useSettings.mockReturnValue({
      settings: tenantSettings,
      isLoading: false,
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

  describe('when there is a locale from user settings', () => {
    it('should apply it for initialValues', async () => {
      renderLanguageLocalization();

      const initialValues = await act(() => ConfigManager.mock.calls[0][0].getInitialValues([{
        value: {
          locale: 'en-GB',
          numberingSystem: 'arab',
          currency: 'TRY',
          timezone: 'Europe/Dublin',
        },
      }]));

      expect(initialValues).toEqual({
        locale: 'en-GB',
      });
    });
  });

  describe('when there is no locale in user settings, but it is present in tenant settings', () => {
    it('should apply tenant locale for initialValues', async () => {
      renderLanguageLocalization();

      const initialValues = await act(() => ConfigManager.mock.calls[0][0].getInitialValues([{
        value: {},
      }]));

      expect(initialValues).toEqual({
        locale: 'en-US',
      });
    });
  });

  describe('when there are user and tenant settings', () => {
    it('should use user settings, if something is missing, then from tenant settings', async () => {
      const newUserSettings = {
        locale: 'en-SE',
      };

      renderLanguageLocalization();

      await act(() => ConfigManager.mock.calls[0][0].getInitialValues([{
        value: userSettings,
      }]));

      const payload = ConfigManager.mock.calls.at(-1)[0].onBeforeSave(newUserSettings);

      expect(payload).toEqual({
        ...tenantSettings,
        ...userSettings,
        ...newUserSettings,
      });
    });
  });

  describe('when user selects the locale that matches tenant locale', () => {
    it('should reset payload', async () => {
      renderLanguageLocalization();

      await act(() => ConfigManager.mock.calls[0][0].getInitialValues([{
        value: {
          locale: 'en-GB',
        },
      }]));

      const payload = ConfigManager.mock.calls.at(-1)[0].onBeforeSave({
        locale: 'en-US',
      });

      expect(payload).toEqual({});
    });
  });

  describe('when empty settings are saved', () => {
    it('should apply tenant locale', () => {
      renderLanguageLocalization();

      ConfigManager.mock.calls[0][0].onAfterSave({
        value: {},
      });

      expect(mockSetLocale).toHaveBeenCalledWith(tenantSettings.locale);
    });
  });

  describe('when not empty settings are saved', () => {
    it('should apply full locale', () => {
      renderLanguageLocalization();

      ConfigManager.mock.calls[0][0].onAfterSave({
        value: {
          locale: 'en-GB',
          numberingSystem: 'arab',
        },
      });

      expect(getFullLocale).toHaveBeenCalledWith('en-GB', 'arab');
    });
  });
});
