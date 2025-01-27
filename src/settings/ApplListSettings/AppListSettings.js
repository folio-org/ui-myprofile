import { useCallback, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { Pane, PaneFooter, Button, LoadingPane } from '@folio/stripes/components';
import { useAppOrderContext, useCallout } from '@folio/stripes/core';
import { useIntl } from 'react-intl';
import listCss from './components/AppOrderList.css';
import AppOrderList from './components/AppOrderList';

const AppOrderListView = () => {
  const { formatMessage } = useIntl();
  const callout = useCallout();

  const { apps, appNavOrder, isLoading, updateList, reset } = useAppOrderContext();


  const [items, setItems] = useState(appNavOrder);

  useEffect(() => {
    setItems(appNavOrder);
  }, [appNavOrder]);

  const handleSave = useCallback(() => {
    try {
      updateList(items);
    } catch (err) {
      callout.sendCallout({ type: 'error', message: 'There was a problem saving app list order' });
    } finally {
      callout.sendCallout({ message: 'Application display order has been successfully updated.' });
    }
  }, [items, callout, updateList]);

  const handleReset = useCallback(() => {
    try {
      reset();
      setItems(appNavOrder);
    } catch (err) {
      callout.sendCallout({ type: 'error', message: 'There was a problem resetting the app order' });
    }
  });

  const renderFooter = () => {
    const disabled = isEqual(items, appNavOrder);

    return (
      <PaneFooter renderEnd={<Button disabled={disabled} buttonStyle="primary" onClick={handleSave}>Save</Button>} />
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
          paneTitle="Application display order"
          footer={renderFooter()}
          lastMenu={<Button onClick={handleReset} marginBottom0>Reset to default</Button>}
        >
          <div className={listCss.appPageLayout}>
            <p><strong>Drag & drop to change the display order of FOLIO applications.</strong></p>
            <div className={listCss.appListContainer} role="application">
              <AppOrderList apps={apps} items={items} setItems={setItems} itemToString={(item) => item.name} />
            </div>
          </div>
        </Pane>
      )}
    </>
  );
};

export default AppOrderListView;
