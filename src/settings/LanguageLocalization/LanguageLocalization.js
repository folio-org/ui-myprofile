import {
  useMemo,
  useRef,
} from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

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

  const ConnectedConfigManager = useMemo(() => stripes.connect(ConfigManager), [stripes]);
  const paneTitle = intl.formatMessage({ id: 'ui-myprofile.settings.languageLocalization.label' });

  const localesOptions = useMemo(() => {
    return localesList(intl, tenantSettings[fieldNames.LOCALE]);
  }, [intl, tenantSettings]);

  const formatPayload = (newSettings) => {
    const userLocale = newSettings[fieldNames.LOCALE];
    const tenantLocale = tenantSettings[fieldNames.LOCALE];

    return {
      ...initialSettings.current,
      ...newSettings,
      isEnabled: userLocale !== tenantLocale,
    };
  };

  const afterSave = ({ value: userSettings }) => {
    const tenantLocale = tenantSettings[fieldNames.LOCALE];

    let locale = userSettings[fieldNames.LOCALE];
    let numberingSystem = userSettings.numberingSystem;

    if (!userSettings.isEnabled) {
      locale = tenantLocale;
      numberingSystem = tenantSettings.numberingSystem;
    }

    const fullLocale = getFullLocale(locale, numberingSystem);

    stripes.setLocale(fullLocale);
  };

  const getInitialValues = ([data]) => {
    const initialUserSettings = data?.value;
    const userLocale = initialUserSettings?.[fieldNames.LOCALE];
    const tenantLocale = tenantSettings[fieldNames.LOCALE];

    initialSettings.current = initialUserSettings;

    let locale = userLocale;

    if (!initialUserSettings?.isEnabled) {
      locale = tenantLocale;
    }

    return {
      [fieldNames.LOCALE]: locale,
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
