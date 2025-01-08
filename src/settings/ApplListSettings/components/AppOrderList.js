import React, { useMemo, useState, useCallback } from 'react';
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

const getProvisionedApps = (stripes, uiModules, formatMessage) => {
  const apps = uiModules.map((entry) => {
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
    const nameString = formatMessage({ id: 'stripes-core.settings' });

    apps.push({
      name: nameString,
      displayName: nameString,
    });
  }

  return apps;
};

function AppOrderList({
  appListArray = []
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const stripes = useStripes();
  const modules = useModules();
  const { formatMessage } = useIntl();

  const appListing = useMemo(() => {
    const apps = getProvisionedApps(stripes, modules.app, formatMessage);

    const orderedApps = appListArray.length === 0 ? apps : appListArray;

    const appList = orderedApps.map((listing) => {
      const { name } = listing;
      const appIndex = apps.findIndex((app) => name === app.name);

      if (appIndex !== -1) {
        return { name: apps[appIndex].name, displayName: apps[appIndex].displayName}
      }

      return false;
    });

    return appList;
  }, [formatMessage, stripes, modules.app, appListArray]);

  const [items, setItems] = useState(appListing);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((listItems) => {
        const oldIndex = listItems.indexOf(active.id);
        const newIndex = listItems.indexOf(over.id);

        return arrayMove(listItems, oldIndex, newIndex);
      });
    }
  }, []);

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
          {
          items.map((app, i) => (
            <AppListItem
              key={app.name}
              id={app}
              index={i}
            >
              {app.displayName}
            </AppListItem>))
          }
        </ol>
      </SortableContext>
    </DndContext>
  );
}

export default AppOrderList;
