import { act } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  useSettings,
  useStripes,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';

import LanguageLocalization from './LanguageLocalization';
import { useTenantLocale } from '../../queries';
import Harness from '../../../test/jest/helpers/Harness';
import buildStripes from '../../../test/jest/__mock__/stripesCore.mock';

jest.mock('../../queries', () => ({
  ...jest.requireActual('../../queries'),
  useTenantLocale: jest.fn().mockReturnValue({}),
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
  numberingSystem: 'arab',
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

    useSettings.mockImplementation(() => ({
      settings: userSettings,
      isLoading: false,
      updateSetting: mockUpdateSetting,
    }));

    useTenantLocale.mockReturnValue({
      tenantLocale: tenantSettings,
      isLoadingTenantLocale: false,
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
      useSettings.mockImplementation(() => ({
        settings: {},
        isLoading: false,
      }));
    });

    it('should display the tenant locale', async () => {
      renderLanguageLocalization();

      const initialValues = await act(() => ConfigManager.mock.calls[0][0].getInitialValues());

      expect(initialValues).toEqual({
        locale: 'en-US',
      });
    });
  });

  describe('when tenant settings and user settings do not have a locale but stripes.locale is set', () => {
    it('should use stripes.locale', async () => {
      useTenantLocale.mockImplementation(() => {
        return {
          tenantLocale: {},
          isLoadingTenantLocale: false,
        };
      });

      useSettings.mockReturnValue({
        settings: {},
        isLoading: false,
      });

      useStripes.mockReturnValue({
        ...stripes,
        locale: 'de-DE',
      });

      renderLanguageLocalization();

      const initialValues = await act(() => ConfigManager.mock.calls[0][0].getInitialValues());

      expect(initialValues).toEqual({
        locale: 'de-DE',
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

      expect(mockSetLocale).toHaveBeenCalledWith('en-GB-u-nu-arab');
    });
  });

  describe('when user clicks on "Reset to default" button', () => {
    it('should apply clear user preferences and apply tenant locale', async () => {
      renderLanguageLocalization();

      await act(() => ConfigManager.mock.calls[0][0].getInitialValues());

      const resetToDefaultButton = screen.getByRole('button', { name: 'ui-myprofile.settings.languageLocalization.resetToDefault' });

      fireEvent.click(resetToDefaultButton);

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        ...userSettings,
        locale: null,
      });
      await waitFor(() => expect(mockSetLocale).toHaveBeenCalledWith('en-US-u-nu-latn'));
    });
  });

  describe('locale field filtering', () => {
    const originalConfigManagerImpl = ConfigManager.getMockImplementation();

    beforeEach(() => {
      // render the ConfigManager's children so the Selection field under test is in the DOM
      ConfigManager.mockImplementation(({ children, lastMenu }) => (
        <div>
          ConfigManager
          {lastMenu}
          {children}
        </div>
      ));
    });

    afterEach(() => {
      ConfigManager.mockImplementation(originalConfigManagerImpl);
    });

    it('renders the locale field as a Selection control with a filterable options list', async () => {
      renderLanguageLocalization();

      const toggleButton = screen.getByRole('button', { name: /Locale/i });

      fireEvent.click(toggleButton);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('matches options by a substring that only appears in the middle of the label ("contains" filtering)', async () => {
      renderLanguageLocalization();

      const toggleButton = screen.getByRole('button', { name: /Locale/i });

      fireEvent.click(toggleButton);

      const filterInput = screen.getByRole('combobox');

      // "China" only appears mid-label, e.g. "Chinese (China) / 中文（中国）" - it would not
      // match under the component's default starts-with filtering.
      fireEvent.change(filterInput, { target: { value: 'China' } });

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');

        expect(options.some((option) => option.textContent.includes('China'))).toBe(true);
      });
    });

    it('returns no options when the filter text does not match any locale label', async () => {
      renderLanguageLocalization();

      const toggleButton = screen.getByRole('button', { name: /Locale/i });

      fireEvent.click(toggleButton);

      const filterInput = screen.getByRole('combobox');

      fireEvent.change(filterInput, { target: { value: 'this-does-not-match-any-locale' } });

      await waitFor(() => {
        const options = within(screen.getByRole('listbox')).getAllByRole('option');

        expect(options).toHaveLength(1);
        expect(options[0]).toHaveTextContent('List is empty');
      });
    });
  });
});
