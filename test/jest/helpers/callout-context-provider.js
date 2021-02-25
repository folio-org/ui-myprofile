import React, { useState } from 'react';

import { CalloutContext } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';

export const CalloutContextProvider = ({ children }) => {
  const [callout, setCallout] = useState(null);

  return (
    <>
      <CalloutContext.Provider value={callout}>
        <div id="OverlayContainer" />
        {children}
      </CalloutContext.Provider>
      <Callout ref={setCallout} />
    </>
  );
};
