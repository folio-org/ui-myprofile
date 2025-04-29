import { useMemo, useState } from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import {
  CommandList,
  Select,
  defaultKeyboardShortcuts
} from '@folio/stripes/components';
import {
  TitleManager,
  tenantLocaleConfig,
  useStripes,
  userOwnLocaleConfig,
  getFullLocale,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { useSettings } from '../../queries';
import { localesList } from './utils';

const fieldNames = {
  LOCALE: 'locale',
};

const LanguageLocalization = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const [userSettings, setUserSettings] = useState();

  const {
    settings: tenantSettings,
  } = useSettings({
    scope: tenantLocaleConfig.SCOPE,
    key: tenantLocaleConfig.KEY,
  });

  const ConnectedConfigManager = useMemo(() => stripes.connect(ConfigManager), [stripes]);
  const paneTitle = intl.formatMessage({ id: 'ui-myprofile.settings.languageLocalization.label' });

  const localesOptions = useMemo(() => {
    return localesList(intl, tenantSettings[fieldNames.LOCALE]);
  }, [intl, tenantSettings]);

  const formatPayload = (payload) => {
    const userLocale = payload[fieldNames.LOCALE];
    const tenantLocale = tenantSettings[fieldNames.LOCALE];

    // reset settings when a user selects the locale that matches the tenant's locale.
    // This means the user wants to stop following user's locale and wants to follow the tenant's one.
    if (userLocale === tenantLocale) {
      return {};
    }

    // 1. Settings from Tenant -> Language and localization
    // 2. Settings from Developer -> User locale
    // 3. Settings from My profile -> Language & localization
    // user locale takes precedence over tenant locale
    return {
      ...tenantSettings,
      ...userSettings,
      ...payload,
    };
  };

  const afterSave = (setting) => {
    const newUserLocale = setting.value[fieldNames.LOCALE];
    const numberingSystem = setting.value.numberingSystem;

    // we make it empty when a user selects the locale that matches the tenant's locale.
    // This means the user wants to stop following user's locale and wants to follow the tenant's one.
    if (isEmpty(setting.value)) {
      stripes.setLocale(tenantSettings[fieldNames.LOCALE]);
    } else {
      const fullLocale = getFullLocale(newUserLocale, numberingSystem);

      stripes.setLocale(fullLocale);
    }
  };

  const getInitialValues = ([data]) => {
    const initialUserSettings = data?.value;
    const userLocale = initialUserSettings?.[fieldNames.LOCALE];
    const tenantLocale = tenantSettings[fieldNames.LOCALE];

    setUserSettings(initialUserSettings);

    return {
      [fieldNames.LOCALE]: userLocale || tenantLocale || document.documentElement.getAttribute('lang'),
    };
  };

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
