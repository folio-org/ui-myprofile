import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { config } from 'stripes-config';
import {
  Button,
  CommandList,
  PaneMenu,
  Select,
  defaultKeyboardShortcuts
} from '@folio/stripes/components';
import {
  TitleManager,
  tenantLocaleConfig,
  useStripes,
  userOwnLocaleConfig,
  getFullLocale,
  useSettings,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { localesList } from './utils';

const fieldNames = {
  LOCALE: 'locale',
};

const LanguageLocalization = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const initialSettings = useRef();

  const {
    settings: tenantSettings,
  } = useSettings({
    scope: tenantLocaleConfig.SCOPE,
    key: tenantLocaleConfig.KEY,
  });

  const {
    settings: userSettings,
    updateSetting: updateUserSetting,
  } = useSettings({
    scope: userOwnLocaleConfig.SCOPE,
    key: userOwnLocaleConfig.KEY,
    userId: stripes.user?.user?.id,
  });

  const ConnectedConfigManager = useMemo(() => stripes.connect(ConfigManager), [stripes]);
  const paneTitle = intl.formatMessage({ id: 'ui-myprofile.settings.languageLocalization.label' });
  const userHasSetLocalePreferences = !!userSettings[fieldNames.LOCALE];

  // tenant configuration might not have a set locale - try stripes-config locale and default to en-US
  const tenantLocale = tenantSettings[fieldNames.LOCALE] || config.locale || 'en-US';
  const localesOptions = useMemo(() => localesList(intl, tenantSettings[fieldNames.LOCALE]), [intl, tenantSettings]);

  const formatPayload = (newSettings) => {
    return {
      [fieldNames.LOCALE]: initialSettings.current,
      ...newSettings,
    };
  };

  const afterSave = ({ value: settings }) => {
    const locale = settings[fieldNames.LOCALE];
    // user can't select numbering system in My Profile, so we can just use tenant settings
    const numberingSystem = tenantSettings.numberingSystem;
    const fullLocale = getFullLocale(locale, numberingSystem);

    stripes.setLocale(fullLocale);
  };

  const getInitialValues = () => {
    const userLocale = userSettings?.[fieldNames.LOCALE];

    initialSettings.current = userLocale;

    return {
      [fieldNames.LOCALE]: userLocale || tenantLocale,
    };
  };

  const handleResetToDefault = useCallback(async () => {
    const numberingSystem = tenantSettings.numberingSystem;
    const fullLocale = getFullLocale(tenantLocale, numberingSystem);

    await updateUserSetting({
      scope: userOwnLocaleConfig.SCOPE,
      key: userOwnLocaleConfig.KEY,
      [fieldNames.LOCALE]: null,
    });

    stripes.setLocale(fullLocale);
  }, [updateUserSetting, stripes, tenantSettings, tenantLocale]);

  const lastMenu = useMemo(() => (
    <PaneMenu>
      <Button
        onClick={handleResetToDefault}
        buttonStyle="primary"
        disabled={!userHasSetLocalePreferences}
        marginBottom0
      >
        <FormattedMessage id="ui-myprofile.settings.languageLocalization.resetToDefault" />
      </Button>
    </PaneMenu>
  ), [handleResetToDefault, userHasSetLocalePreferences]);

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <TitleManager record={paneTitle}>
        <ConnectedConfigManager
          formType="final-form"
          label={paneTitle}
          scope={userOwnLocaleConfig.SCOPE}
          configName={userOwnLocaleConfig.KEY}
          getInitialValues={getInitialValues}
          userId={stripes.user.user.id}
          stripes={stripes}
          onBeforeSave={formatPayload}
          onAfterSave={afterSave}
          lastMenu={lastMenu}
        >
          <Field
            id={fieldNames.LOCALE}
            name={fieldNames.LOCALE}
            label={intl.formatMessage({ id: 'ui-myprofile.settings.languageLocalization.fieldLocale.label' })}
            dataOptions={localesOptions}
            component={Select}
          />
        </ConnectedConfigManager>
      </TitleManager>
    </CommandList>
  );
};

export default LanguageLocalization;
