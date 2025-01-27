import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import uniqueId from 'lodash/uniqueId';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  restrictToWindowEdges
} from '@dnd-kit/modifiers';
import { useIntl } from 'react-intl';

import { useDOMKeyboardCoordinates } from './MultiColumnKeyboardCoordinateGetter';

import { AppIcon } from '@folio/stripes/core';

import DraggableAppListItem from './DraggableAppListItem';
import listCss from './AppOrderList.css';

function AppOrderList({
  apps,
  items,
  setItems,
  itemToString = () => {},
  id: idProp,
}) {
  const { formatMessage, locale } = useIntl();
  const id = useRef(idProp || uniqueId('draglist-')).current;
  const [draggable, setDraggable] = useState(items.map(itemToString));

  useEffect(() => {
    setDraggable(items.map(itemToString));
  }, [items, itemToString]);

  const announcements = useMemo(() => {
    const getPosition = (dndId) => draggable.indexOf(dndId) + 1; // prefer position over index
    const itemCount = draggable.length;

    const messages = {
      onDragStart({ active }) {
        return formatMessage(
          { id: 'ui-myprofile.draggableList.announcements.dragStart' },
          { active, position: getPosition(active), total: itemCount }
        );
      },
      onDragOver({ active, over}) {
        if (over) {
          return formatMessage(
            { id: 'ui-myprofile.draggableList.announcements.dragOver' },
            { active, position: getPosition(over) }
          );
        }
      },
      onDragEnd({ active, over }) {
        if (over) {
          return formatMessage(
            { id: 'ui-myprofile.draggableList.announcements.dragEmd' },
            { active, position: getPosition(over) }
          );
        }
      },
      onDragCancel({ active }) {
        return formatMessage(
          { id: 'ui-myprofile.draggableList.announcements.dragCancel' },
          { active }
        );
      },
    };

    return messages;
  }, [formatMessage, locale, draggable])


  const { getter } = useDOMKeyboardCoordinates({ id });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: getter,
    })
  );

  const getAppIconProps = useCallback((name) => {
    const appIndex = apps.findIndex((a) => a.name === name);

    if (appIndex !== -1) {
      return {
        app: apps[appIndex].module,
        size: 'small',
        icon: apps[appIndex].iconData
      };
    }
  }, [apps]);

  const getAppDisplayName = useCallback((name) => {
    const appIndex = apps.findIndex((a) => a.name === name);

    if (appIndex !== -1) {
      return apps[appIndex].displayName;
    }

    return '';
  });

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (over && over?.id !== active?.id) {
      setDraggable((listItems) => {
        const oldIndex = listItems.indexOf(active.id);
        const newIndex = listItems.indexOf(over.id);

        const res = arrayMove(listItems, oldIndex, newIndex);

        setItems(res.map((dn) => {
          const itemIndex = items.findIndex(item => dn === itemToString(item));

          return items[itemIndex];
        }));

        return res;
      });
    }
  }, [setItems, items]);



  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      accessibility={announcements}
      screenReaderInstructions={formatMessage({ id: 'ui-myprofile.draggableList.instructions' })}
    >
      <SortableContext
        items={draggable}
      >
        <ol className={listCss.draggableList} id={id}>
          {
            draggable.map((appName, i) => {
              return (
                <DraggableAppListItem
                  id={appName}
                  key={appName}
                  index={i + 1}
                  isNew={items[i].isNew}
                >
                  &nbsp;
                  <AppIcon
                    {...getAppIconProps(appName)}
                  />
                  &nbsp;
                  <span>{getAppDisplayName(appName)}</span>
                </DraggableAppListItem>
              );
            })
          }
        </ol>
      </SortableContext>
    </DndContext>
  );
}

export default AppOrderList;
