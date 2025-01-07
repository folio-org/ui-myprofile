import React, { memo, useState, useCallback } from 'react';
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
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useStripes, useModules } from '@folio/stripes/core';
import { useIntl } from 'react-intl';

import AppListItem from './AppListItem';

const packageName = {
  // Expects to follow the scoping rules defined by nodejs: https://docs.npmjs.com/files/package.json#name
  PACKAGE_SCOPE_REGEX: /^@[a-z\d][\w-.]{0,214}\//,
};


function AppOrderList() {
  const [items, setItems] = useState([
    'App1',
    'App2',
    'App3',
    'App4',
    'App5',
    'App6',
    'App7',
    'App8',
    'App9',
    'App10',
    'App11',
    'App12',
    'App13',
    'App14',
    'App15',
    'App16',
    'App17',
    'App18',
    'App19',
    'App20',
    'App21',
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const stripes = useStripes();
  const modules = useModules();
  const { formatMessage } = useIntl();

  const filteredApps = memo(() => {
    const apps = () => modules.app.map((entry) => {
      const name = entry.module.replace(packageName.PACKAGE_SCOPE_REGEX, '');
      const perm = `module.${name}.enabled`;

      if (!stripes.hasPerm(perm)) {
        return null;
      }

      const id = `clickable-${name}-module`;


      return {
        id,
        // href,
        // active,
        name,
        ...entry,
      };
    }).filter(app => app);

    /**
     * Add Settings to apps array manually
     * until Settings becomes a standalone app
     */

    if (stripes.hasPerm('settings.enabled')) {
      apps.push({
        name: formatMessage({ id: 'stripes-core.settings' }),
      });
    }

    return apps;
  }, [modules.app]);


  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((listItems) => {
        const oldIndex = listItems.indexOf(active.id);
        const newIndex = listItems.indexOf(over.id);

        return arrayMove(listItems, oldIndex, newIndex);
      });
    }
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
      >
        <ol style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxHeight: '100%', listStylePosition: 'inside' }}>
          {filteredApps.map(({ name }) => <AppListItem key={name} id={name}>{name}</AppListItem>)}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

export default AppOrderList;
