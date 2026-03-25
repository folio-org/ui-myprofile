import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  CommandList,
  PaneMenu,
  Select,
  defaultKeyboardShortcuts
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
  userOwnLocaleConfig,
  getFullLocale,
  useSettings,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { localesList } from './utils';
import { useTenantLocale } from '../../queries';

const fieldNames = {
  LOCALE: 'locale',
};

const LanguageLocalization = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const initialSettings = useRef();

  const { tenantLocale: tenantLocaleConfig } = useTenantLocale();

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
  const tenantLocale = tenantLocaleConfig?.[fieldNames.LOCALE] || stripes.locale || 'en-US';
  const localesOptions = useMemo(() => localesList(intl, tenantLocaleConfig?.[fieldNames.LOCALE]), [intl, tenantLocaleConfig]);

  const formatPayload = (newSettings) => {
    return {
      ...initialSettings.current,
      ...newSettings,
    };
  };

  const afterSave = ({ value: settings }) => {
    const locale = settings[fieldNames.LOCALE];
    const numberingSystem = settings.numberingSystem;
    const fullLocale = getFullLocale(locale, numberingSystem);

    stripes.setLocale(fullLocale);
  };

  const getInitialValues = () => {
    const userLocale = userSettings?.[fieldNames.LOCALE];

    initialSettings.current = userSettings;

    return {
      [fieldNames.LOCALE]: userLocale || tenantLocale,
    };
  };

  const handleResetToDefault = useCallback(async () => {
    const numberingSystem = tenantLocaleConfig?.numberingSystem;
    const fullLocale = getFullLocale(tenantLocale, numberingSystem);

    await updateUserSetting({
      ...initialSettings.current,
      [fieldNames.LOCALE]: null,
    });

    stripes.setLocale(fullLocale);
  }, [updateUserSetting, stripes, tenantLocaleConfig, tenantLocale]);

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
