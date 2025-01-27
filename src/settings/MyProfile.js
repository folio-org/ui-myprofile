import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';

import { Settings } from '@folio/stripes/smart-components';
import { stripesShape, TitleManager } from '@folio/stripes/core';

import ChangePassword from './ChangePassword';
import AppListSettingsView from './ApplListSettings';

class MyProfile extends Component {
  static isLocalLogin(stripes) {
    return !stripes.okapi.ssoEnabled;
  }

  static propTypes = {
    actAs: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool.isRequired,
    stripes: stripesShape.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.pages = this.createSettingsPages();
  }

  createSettingsPages() {
    return [
      {
        route: 'appList',
        label: 'Application display order',
        component: AppListSettingsView,
        perm: 'ui-myprofile.settings.change-nav-order',
      }
    ]
      .concat(
        this.registerChangePasswordPage()
      )
      .filter((page) => page);
  }

  registerChangePasswordPage() {
    const { ssoEnabled } = this.props.stripes.okapi;
    const showPasswordPage = !ssoEnabled;

    /* istanbul ignore if  */
    if (!showPasswordPage) {
      return undefined;
    }

    return {
      route: 'password',
      label: <FormattedMessage id="ui-myprofile.settings.changePassword.label" />,
      component: ChangePassword,
      perm: 'ui-myprofile.settings.change-password',
    };
  }

  render() {
    /* istanbul ignore if  */
    if (!this.pages.length) return null;

    const {
      actAs,
      location,
      match,
      showSettings,
      stripes,
      intl: { formatMessage },
    } = this.props;

    return (
      <TitleManager page={formatMessage({ id: 'ui-myprofile.label.settings' })}>
        <Settings
          actAs={actAs}
          location={location}
          match={match}
          showSettings={showSettings}
          stripes={stripes}
          pages={this.pages}
          paneTitle={<FormattedMessage id="ui-myprofile.settings.index.paneTitle" />}
        />
      </TitleManager>
    );
  }
}

export default injectIntl(MyProfile);
