import { createIntl, createIntlCache } from 'react-intl';

import { supportedLocales } from '@folio/stripes/core';

import { filterLocalesByContains, localesList } from './utils';

const dataOptions = [
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'en-US', label: 'English (United States)' },
  { value: 'fr-FR', label: 'French (France)' },
];

describe('filterLocalesByContains', () => {
  it('matches a substring anywhere in the label, not just at the start', () => {
    expect(filterLocalesByContains('kingdom', dataOptions)).toEqual([
      { value: 'en-GB', label: 'English (United Kingdom)' },
    ]);
  });

  it('matches case-insensitively', () => {
    expect(filterLocalesByContains('KINGDOM', dataOptions)).toEqual([
      { value: 'en-GB', label: 'English (United Kingdom)' },
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterLocalesByContains('xyz', dataOptions)).toEqual([]);
  });

  it('returns all options when the filter term is empty', () => {
    expect(filterLocalesByContains('', dataOptions)).toEqual(dataOptions);
  });

  it('matches labels shared by multiple options', () => {
    expect(filterLocalesByContains('english', dataOptions)).toEqual([
      { value: 'en-GB', label: 'English (United Kingdom)' },
      { value: 'en-US', label: 'English (United States)' },
    ]);
  });

  it('returns an empty array when dataOptions is empty', () => {
    expect(filterLocalesByContains('english', [])).toEqual([]);
  });

  it('returns an empty array when dataOptions is omitted', () => {
    expect(filterLocalesByContains('english')).toEqual([]);
  });

  it('does not match a substring split across non-adjacent words', () => {
    expect(filterLocalesByContains('gbfrance', dataOptions)).toEqual([]);
  });

  it('treats whitespace in the filter term literally', () => {
    expect(filterLocalesByContains('united kingdom', dataOptions)).toEqual([
      { value: 'en-GB', label: 'English (United Kingdom)' },
    ]);
  });
});

describe('localesList', () => {
  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: 'en',
      messages: {
        'ui-myprofile.settings.languageLocalization.tenantDefault': 'Tenant default',
      },
      onError: () => {},
    },
    cache,
  );

  it('returns one {value, label} entry per supported locale', () => {
    const locales = localesList(intl, 'en-US');

    expect(locales).toHaveLength(supportedLocales.length);
    expect(locales.map(({ value }) => value).sort()).toEqual([...supportedLocales].sort());
    locales.forEach(({ label }) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('sorts entries alphabetically by label', () => {
    const locales = localesList(intl, 'en-US');
    const labels = locales.map(({ label }) => label);
    const sortedLabels = [...labels].sort((a, b) => a.localeCompare(b));

    expect(labels).toEqual(sortedLabels);
  });

  it('appends the tenant-default marker only to the entry matching tenantLocale', () => {
    const locales = localesList(intl, 'en-US');
    const withMarker = locales.filter(({ label }) => label.includes('Tenant default'));

    expect(withMarker).toHaveLength(1);
    expect(withMarker[0].value).toBe('en-US');
  });

  it('adds no tenant-default marker when tenantLocale matches no supported locale', () => {
    const locales = localesList(intl, 'xx-XX');

    expect(locales.some(({ label }) => label.includes('Tenant default'))).toBe(false);
  });
});
