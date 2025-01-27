import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Icon } from '@folio/stripes/components';
import listCss from './AppOrderList.css';

export default ({ id, children, index, isNew }) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li ref={setNodeRef} className={`${listCss.reorderListItem}`} style={style}>
      <div data-draggable-item={id} className={`${listCss.listItemContent}${active?.id === id ? ' ' + listCss.activeItem : ''}`} {...attributes} {...listeners}>
        <div className={listCss.listItemLabel}>
          <span>{index}.</span>
          {children}
        </div>
        <div>
          {isNew && <strong>New!</strong> }
          <Icon iconClassName={listCss.dragIcon} icon="drag-drop" style={{ opacity: '50' }} />
        </div>
      </div>
    </li>
  );
};
