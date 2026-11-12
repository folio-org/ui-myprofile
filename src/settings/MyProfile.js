import { useIntl, FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';

import { Settings } from '@folio/stripes/smart-components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import ChangePassword from './ChangePassword';
import AppListSettings from './AppOrderSettings';
import LanguageLocalization from './LanguageLocalization';
import useApplicationSettings from './useApplicationSettings';

const MyProfile = ({
  actAs,
  location,
  match,
  showSettings,
}) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const pages = [
    {
      route: 'app-order',
      label: <FormattedMessage id="ui-myprofile.settings.appNavOrder.label" />,
      component: AppListSettings,
      perm: 'ui-myprofile.settings.main-nav-order.manage',
    }
  ]
    .concat(
      stripes.okapi.ssoEnabled ? undefined : {
        route: 'password',
        label: <FormattedMessage id="ui-myprofile.settings.changePassword.label" />,
        component: ChangePassword,
        perm: 'ui-myprofile.settings.change-password',
      }
    )
    .concat({
      route: 'language-localization',
      label: <FormattedMessage id="ui-myprofile.settings.languageLocalization.label" />,
      component: LanguageLocalization,
    })
    .filter(Boolean);

  const applicationPages = useApplicationSettings();

  const sections = [
    { label: formatMessage({ id: 'ui-myprofile.label.section.myprofileSettings' }), pages },
    { label: formatMessage({ id: 'ui-myprofile.label.section.applicationSettings' }), pages: applicationPages },
  ];

  if (pages.length || applicationPages.length) {
    return (
      <TitleManager page={formatMessage({ id: 'ui-myprofile.label.settings' })}>
        <Settings
          actAs={actAs}
          location={location}
          match={match}
          showSettings={showSettings}
          stripes={stripes}
          sections={sections}
          paneTitle={<FormattedMessage id="ui-myprofile.settings.index.paneTitle" />}
        />
      </TitleManager>
    );
  }

  return null;
};

MyProfile.propTypes = {
  actAs: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  showSettings: PropTypes.bool.isRequired,
};

export default MyProfile;
