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
    return {
      ...initialSettings.current,
      ...newSettings,
    };
  };

  const afterSave = ({ value: settings }) => {
    const userLocale = settings[fieldNames.LOCALE];
    const tenantLocale = tenantSettings[fieldNames.LOCALE];

    let locale = settings[fieldNames.LOCALE];
    let numberingSystem = settings.numberingSystem;

    if (userLocale === tenantLocale) {
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

    return {
      [fieldNames.LOCALE]: userLocale || tenantLocale,
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
