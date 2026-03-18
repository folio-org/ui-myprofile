import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import {
  QueryClientProvider,
  QueryClient,
} from 'react-query';

import {
  CalloutContext,
  StripesContext,
} from '@folio/stripes/core';

import translationsProperties from './translationsProperties';
import prefixKeys from './prefixKeys';
import buildStripes from '../__mock__/stripesCore.mock';
import translations from '../../../translations/ui-myprofile/en';

const client = new QueryClient();

const STRIPES = buildStripes();

const Harness = ({
  children,
  translations: translationsConfig,
  stripes,
}) => {
  const allTranslations = prefixKeys(translations);

  (translationsConfig || translationsProperties).forEach(tx => {
    Object.assign(allTranslations, prefixKeys(tx.translations, tx.prefix));
  });

  const defaultRichTextElements = ['b', 'i', 'em', 'strong', 'span', 'div', 'p', 'ul', 'ol', 'li', 'code'].reduce((res, Tag) => {
    res[Tag] = chunks => <Tag>{chunks}</Tag>;

    return res;
  }, {});

  return (
    <QueryClientProvider client={client}>
      <StripesContext.Provider value={stripes || STRIPES}>
        <CalloutContext.Provider value={{ sendCallout: () => { } }}>
          <IntlProvider
            locale="en"
            key="en"
            timeZone="UTC"
            onWarn={() => {}}
            onError={() => {}}
            defaultRichTextElements={defaultRichTextElements}
            messages={allTranslations}
          >
            {children}
          </IntlProvider>
        </CalloutContext.Provider>
      </StripesContext.Provider>
    </QueryClientProvider>
  );
};

Harness.propTypes = {
  children: PropTypes.node,
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string,
      translations: PropTypes.object,
    })
  ),
};

export default Harness;
