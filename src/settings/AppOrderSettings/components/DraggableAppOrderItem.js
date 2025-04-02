import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIntl } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import { IconButton } from '@folio/stripes/components';
import listCss from './AppOrderList.css';

// Item template for the draggable nav-reorder list.
export default ({ id, children, index, isNew }) => { // eslint-disable-line react/prop-types
  const { formatMessage } = useIntl();
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const itemId = useRef(uniqueId('draggable-label-')).current;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li ref={setNodeRef} className={`${listCss.reorderListItem}`} style={style}>
      <div data-draggable-item={id} className={`${listCss.listItemContent}${active?.id === id ? ' ' + listCss.activeItem : ''}`}>
        <div className={listCss.listItemLabel} id={itemId}>
          <span>{index}.</span>
          {children}
        </div>
        <div>
          {isNew && <strong>{formatMessage({ id: 'ui-myprofile.settings.appNavOrder.newItem' })}</strong> }
          <IconButton {...attributes} {...listeners} aria-labelledby={itemId} iconClassName={listCss.dragIcon} icon="drag-drop" style={{ opacity: '50' }} />
        </div>
      </div>
    </li>
  );
};
