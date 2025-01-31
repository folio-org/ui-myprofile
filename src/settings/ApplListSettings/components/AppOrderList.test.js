
import {
  cleanup,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
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
    const expected = [{ name: 'next' }, { name: 'this'}, { name: 'last' }];

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

  describe('getAnnouncements', () => {
    const draggable = ['this', 'next', 'last'];
    const annoucements = getAnnouncementMessages(draggable, (msg) => msg.id);
    const args = { active: true, over: true };

    it('returns the proper message for DragStart', () => {
      expect(annoucements.onDragStart(args)).toEqual('ui-myprofile.draggableList.announcements.dragStart');
    });

    it('returns the proper message for DragOver', () => {
      expect(annoucements.onDragOver(args)).toEqual('ui-myprofile.draggableList.announcements.dragOver');
    });

    it('returns the proper message for DragEnd', () => {
      expect(annoucements.onDragEnd(args)).toEqual('ui-myprofile.draggableList.announcements.dragEnd');
    });

    it('returns the proper message for DragCancel', () => {
      expect(annoucements.onDragCancel(args)).toEqual('ui-myprofile.draggableList.announcements.dragCancel');
    });
  });
});
