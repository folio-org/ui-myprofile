import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppIcon } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';

export default ({ id, children, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    margin: '2px 8px',
    flex: '0 1 25%',
    backgroundColor: '#efefef'
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Icon icon="drag-drop" />
      {children}
    </li>
  );
};
