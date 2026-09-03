import { containsFilter } from './utils';

const dataOptions = [
  { value: 'ar', label: 'Arabic / العربية' },
  { value: 'zh-CN', label: 'Chinese (China) / 中文（中国）' },
  { value: 'en-US', label: 'English / English (Tenant default)' },
  { value: 'en-GB', label: 'English (United Kingdom) / English (United Kingdom)' },
];

describe('containsFilter', () => {
  it('matches when the filter text is a substring at the start of the label', () => {
    expect(containsFilter('Arabic', dataOptions)).toEqual([dataOptions[0]]);
  });

  it('matches when the filter text is a substring in the middle of the label', () => {
    expect(containsFilter('China', dataOptions)).toEqual([dataOptions[1]]);
  });

  it('matches when the filter text is a substring at the end of the label', () => {
    expect(containsFilter('default)', dataOptions)).toEqual([dataOptions[2]]);
  });

  it('matches case-insensitively', () => {
    expect(containsFilter('CHINA', dataOptions)).toEqual([dataOptions[1]]);
    expect(containsFilter('china', dataOptions)).toEqual([dataOptions[1]]);
  });

  it('returns all options unchanged when the filter string is empty', () => {
    expect(containsFilter('', dataOptions)).toEqual(dataOptions);
  });

  it('returns an empty array when there are no matches', () => {
    expect(containsFilter('nonexistent-locale-string', dataOptions)).toEqual([]);
  });

  it('matches multiple options that contain the substring', () => {
    expect(containsFilter('English', dataOptions)).toEqual([dataOptions[2], dataOptions[3]]);
  });

  it('escapes regular expression special characters in the filter value', () => {
    expect(containsFilter('(China', dataOptions)).toEqual([dataOptions[1]]);
  });
});
