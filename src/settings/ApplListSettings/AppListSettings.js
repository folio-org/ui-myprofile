import { useCallback, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { Pane, PaneFooter, Button, LoadingPane } from '@folio/stripes/components';
import { useAppOrderContext, useCallout } from '@folio/stripes/core';
import { useIntl } from 'react-intl';
import listCss from './components/AppOrderList.css';
import { AppOrderList } from './components/AppOrderList';

// This view functions as the form logic wrapper for the main navigation reordering.
// It holds the state for the re-order list and implements functions for saving and
// resetting the preference via provided utilities from the `AppOrderContext` from stripes-core.
// We feed this state and form callbacks into the AppOrderList - where the drag/drop functionality resides.
const AppListSettings = () => {
  const { formatMessage } = useIntl();
  const callout = useCallout();

  const { apps, appNavOrder, isLoading, updateList, reset } = useAppOrderContext();


  const [items, setItems] = useState(appNavOrder);

  useEffect(() => {
    setItems(appNavOrder);
  }, [appNavOrder]);

  // Save the preference using `updateList` function from the AppOrderContext
  const handleSave = useCallback(() => {
    try {
      updateList(items);
    } catch (err) {
      callout.sendCallout({ type: 'error', message: formatMessage({ id: 'ui-myprofile.settings.appNavOrder.saveError' }) });
    } finally {
      callout.sendCallout({ message: formatMessage({ id: 'ui-myprofile.settings.appNavOrder.saveSuccess' }) });
    }
  }, [items, callout, updateList, formatMessage]);

  // Reset the list using the `reset` function from the AppOrderContext
  const handleReset = useCallback(() => {
    try {
      reset();
      setItems(appNavOrder);
      callout.sendCallout({ message: formatMessage({ id: 'ui-myprofile.settings.appNavOrder.resetSuccess' }) });
    } catch (err) {
      callout.sendCallout({ type: 'error', message: formatMessage({ id: 'ui-myprofile.settings.appNavOrder.resetError' }) });
    }
  }, [formatMessage, appNavOrder, reset, callout]);

  const renderFooter = () => {
    const disabled = isEqual(items, appNavOrder);

    return (
      <PaneFooter renderEnd={
        <Button disabled={disabled} buttonStyle="primary" onClick={handleSave}>
          {formatMessage({ id: 'ui-myprofile.settings.appNavOrder.save' })}
        </Button>}
      />
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingPane id="appListOrderPane" />
      ) : (
        <Pane
          defaultWidth="fill"
          id="appListOrderPane"
          paneTitle={formatMessage({ id: 'ui-myprofile.settings.appNavOrder.label' })}
          footer={renderFooter()}
          lastMenu={<Button onClick={handleReset} disabled={appNavOrder.length === 0} marginBottom0>{formatMessage({ id: 'ui-myprofile.settings.appNavOrder.reset' })}</Button>}
        >
          <div className={listCss.appPageLayout}>
            <p><strong>{formatMessage({ id: 'ui-myprofile.settings.appNavOrder.visibleInstruction' })}</strong></p>
            <div className={listCss.appListContainer} role="application">
              <AppOrderList apps={apps} items={items} setItems={setItems} itemToString={(item) => item.name} />
            </div>
          </div>
        </Pane>
      )}
    </>
  );
};

export default AppListSettings;
