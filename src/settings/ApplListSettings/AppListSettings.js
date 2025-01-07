import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Pane, PaneFooter, Button, LoadingPane } from '@folio/stripes/components';

import AppOrderList from './components/AppOrderList';
import usePreferences from './hooks/usePreferences';

const AppOrderListView = () => {
  const { getPreference, setPreference } = usePreferences();

  const { data: appListArray, isLoading } = useQuery('UserPrefsAppListing', () => {
    getPreference('user_AppListOrder');
  });

  const handleSave = useCallback(() => {
    setPreference('user_AppListOrder', appListArray);
  }, [appListArray, setPreference]);

  const renderFooter = () => (
    <PaneFooter renderEnd={<Button onClick={handleSave}>Save</Button>} />
  );

  return (
    <>
      {isLoading ? (
        <LoadingPane id="appListOrderPane" />
      ) : (
        <Pane defaultWidth="fill" id="appListOrderPane" paneTitle="App list settings" footer={renderFooter()}>
          <AppOrderList appListArray={appListArray} />
        </Pane>
      )}
    </>
  );
};

export default AppOrderListView;
