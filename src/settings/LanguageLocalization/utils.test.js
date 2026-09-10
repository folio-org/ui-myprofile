import { containsFilter } from './utils';

describe('containsFilter', () => {
  const options = [
    { value: 'en-US', label: 'English (United States)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'fr-FR', label: 'French (France)' },
  ];

  it('returns options whose label starts with the filter text', () => {
    expect(containsFilter('english', options)).toEqual([options[0], options[1]]);
  });

  it('returns options whose label contains the filter text in the middle or end, not just at the start', () => {
    expect(containsFilter('kingdom', options)).toEqual([options[1]]);
  });

  it('matches case-insensitively', () => {
    expect(containsFilter('FRANCE', options)).toEqual([options[2]]);
  });

  it('returns an empty array when no label matches', () => {
    expect(containsFilter('xyz', options)).toEqual([]);
  });

  it('defaults to an empty list when no options are provided', () => {
    expect(containsFilter('english')).toEqual([]);
  });
});
