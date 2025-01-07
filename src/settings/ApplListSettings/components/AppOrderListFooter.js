import { useCallback } from 'react';
import { Panefooter, Row, Col, Button } from '@folio/stripes/components';
import usePreferences from '../hooks/usePreferences';

export default (appListArray) => {
  const { setPreference } = usePreferences();

  const handleSave = useCallback(() => {
    setPreference('appListOrder', appListArray);
  }, [appListArray, setPreference]);

  return (
    <Panefooter renderEnd={<Button onClick={handleSave}>Save</Button>} />
  );
};
