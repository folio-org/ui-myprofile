import { filterLocalesByContains } from './utils';

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
});
