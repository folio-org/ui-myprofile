
import {
  cleanup,
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import AppOrderList from './AppOrderList';

const testSingleApp = [{
  active: false,
  description: 'FOLIO settings',
  displayName: 'stripes-core.settings',
  href: '/settings',
  iconData: {
    alt: 'Tenant Settings',
    src: '',
    title: 'Settings',
  },
  id: 'clickable-settings',
  name: 'settings',
  route: '/settings',
}];

const singleTestItem = [{ name: 'settings' }];

const AppListRenderer = (props) => {
  return (
    <AppOrderList {...props} />
  );
};

describe('AppOrderList', () => {
  let rendered;

  beforeEach(async () => {
    rendered = render(<AppListRenderer apps={testSingleApp} items={singleTestItem} itemToString={(item) => item.name} />);
  });

  it('renders', () => {
    expect(rendered.getByRole('list')).toBeInTheDocument();
  });

  it('renders the list item', () => {
    expect(rendered.getByRole('listitem')).toBeInTheDocument();
  });
});
