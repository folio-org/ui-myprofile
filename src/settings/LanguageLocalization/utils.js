import {
  createIntlCache,
  createIntl,
} from 'react-intl';

import { supportedLocales } from '@folio/stripes/core';

/**
 * localesList: list of available locales suitable for a Select
 * label contains language in context's locale and in iteree's locale
 * e.g. given the context's locale is `en` and the keys `ar` and `zh-CN` show:
 *     Arabic / العربية
 *     Chinese (China) / 中文（中国）
 * e.g. given the context's locale is `ar` and the keys `ar` and `zh-CN` show:
 *     العربية / العربية
 *     الصينية (الصين) / 中文（中国）
 * The entry matching `tenantLocale`, if any, has its label suffixed with a
 * "tenant default" marker. The returned array is sorted by `label`.
 *
 * @param {object} intl react-intl object in the current context's locale
 * @param {string} [tenantLocale] the tenant's configured default locale code, if any
 * @returns {Array<{value: string, label: string}>} locale entries, sorted by
 *   `label`; `value` is the locale code and `label` is its display name
 *   (with a tenant-default marker appended when it matches `tenantLocale`)
 */
export const localesList = (intl, tenantLocale) => {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache();

  // error handler if an intl context cannot be created,
  // i.e. if the browser is missing support for the requested locale
  const logLocaleError = (e) => {
    console.warn(e); // eslint-disable-line
  };

  // iterate through the locales list to build an array of { value, label } objects
  const locales = supportedLocales.map(l => {
    // intl instance with locale of current iteree
    const lIntl = createIntl({
      locale: l,
      messages: {},
      onError: logLocaleError,
    },
    cache);

    const label = `${intl.formatDisplayName(l, { type: 'language' })} / ${lIntl.formatDisplayName(l, { type: 'language' })}`;

    if (l === tenantLocale) {
      return {
        value: l,
        label: `${label} (${intl.formatMessage({ id: 'ui-myprofile.settings.languageLocalization.tenantDefault' })})`,
      };
    }

    return {
      value: l,
      label,
    };
  });

  locales.sort((a, b) => a.label.localeCompare(b.label));

  return locales;
};
