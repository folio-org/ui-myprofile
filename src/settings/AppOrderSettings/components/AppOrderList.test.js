
import {
  cleanup,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import { useIntl } from 'react-intl';
import { AppOrderList, dragEndHandler, getAnnouncementMessages } from './AppOrderList';

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

  afterEach(() => {
    cleanup();
  });

  // dragEndHandler will move the dragged 'active' object to the array position of the
  // 'over' object.
  describe('dragEndHandler', () => {
    const expected = [{ name: 'next' }, { name: 'this' }, { name: 'last' }];

    // let items = [{ name: 'this' }, { name: 'next' }, { name: 'last' }];
    const draggable = ['this', 'next', 'last'];

    let state = [{ name: 'this' }, { name: 'next' }, { name: 'last' }];
    const setItems = (newItem) => { state = newItem; };
    const setDraggable = (fn) => fn(draggable);
    const itemToString = (item) => item.name;

    it('changes the order of the initial array', () => {
      dragEndHandler(
        { active: { id: 'this' }, over: { id: 'next' } },
        state,
        setItems,
        itemToString,
        setDraggable
      );
      expect(state).toEqual(expected);
    });
  });
});

describe('getAnnouncements', () => {
  const AnnouncementsComponent = ({ handler }) => {
    const { formatMessage } = useIntl();
    const draggable = ['this', 'next', 'last'];

    const messages = getAnnouncementMessages(draggable, formatMessage);
    const args = { active: 'next', over: 'last' };

    return <span>{messages[handler](args)}</span>;
  };

  let result;

  it('returns the proper message for DragStart', () => {
    result = render(<AnnouncementsComponent handler="onDragStart" />);
    expect(result.getByText('ui-myprofile.draggableList.announcements.dragStart')).toBeInTheDocument();
  });

  it('returns the proper message for onDragCancel', () => {
    result = render(<AnnouncementsComponent handler="onDragCancel" />);
    expect(result.getByText('ui-myprofile.draggableList.announcements.dragCancel')).toBeInTheDocument();
  });

  it('returns the proper message for onDragOver', () => {
    result = render(<AnnouncementsComponent handler="onDragOver" />);
    expect(result.getByText('ui-myprofile.draggableList.announcements.dragOver')).toBeInTheDocument();
  });

  it('returns the proper message for onDragEnd', () => {
    result = render(<AnnouncementsComponent handler="onDragEnd" />);
    expect(result.getByText('ui-myprofile.draggableList.announcements.dragEnd')).toBeInTheDocument();
  });
});
