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
} from '@folio/jest-config-stripes/testing-library/react';

import LanguageLocalization, { filterByContains } from './LanguageLocalization';
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

  describe('locale Selection field filtering', () => {
    // ConfigManager is normally mocked to render only its "lastMenu" prop. react-final-form
    // re-renders LanguageLocalization (and so ConfigManager) after the initial mount, so a
    // mockImplementationOnce override would only apply to the first, discarded render; use a
    // regular mockImplementation, restored afterwards, so every render for this test shows children.
    const defaultConfigManagerImpl = ConfigManager.getMockImplementation();

    afterEach(() => {
      ConfigManager.mockImplementation(defaultConfigManagerImpl);
    });

    it('should narrow the options by a substring that is not a prefix of any label', async () => {
      ConfigManager.mockImplementation(({ children, lastMenu }) => (
        <div>
          {children}
          {lastMenu}
        </div>
      ));

      renderLanguageLocalization();

      // the Selection field's id mirrors the "locale" field name
      fireEvent.click(document.getElementById('locale'));

      const filterInput = screen.getByRole('combobox');

      fireEvent.change(filterInput, { target: { value: 'ish' } });

      await waitFor(() => {
        const options = screen.getAllByRole('option');

        expect(options.length).toBeGreaterThan(0);
        options.forEach((option) => {
          expect(option.textContent.toLowerCase()).toContain('ish');
        });
      });

      const matchesOnlyAsSubstring = screen.getAllByRole('option').some((option) => {
        const text = option.textContent.toLowerCase();

        return text.includes('ish') && !text.startsWith('ish');
      });

      expect(matchesOnlyAsSubstring).toBe(true);
    });
  });
});

describe('filterByContains', () => {
  const list = [
    { value: 'en-US', label: 'American English' },
    { value: 'en-GB', label: 'British English' },
    { value: 'pl', label: 'Polish' },
  ];

  it('matches labels by a substring regardless of its position', () => {
    expect(filterByContains('lish', list)).toEqual([
      { value: 'en-US', label: 'American English' },
      { value: 'en-GB', label: 'British English' },
      { value: 'pl', label: 'Polish' },
    ]);
  });

  it('matches case-insensitively', () => {
    expect(filterByContains('POLISH', list)).toEqual([
      { value: 'pl', label: 'Polish' },
    ]);
  });

  it('returns an empty array when no label contains the filter text', () => {
    expect(filterByContains('xyz', list)).toEqual([]);
  });
});
