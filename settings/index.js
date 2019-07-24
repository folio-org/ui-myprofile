import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';

import ChangePassword from './ChangePassword';

class MyProfile extends Component {
  static isLocalLogin(stripes) {
    return !stripes.okapi.ssoEnabled;
  }

  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.pages = this.createSettingsPages();
  }

  createSettingsPages() {
    return []
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

    const changePasswordPageSettings = {
      route: 'password',
      label: <FormattedMessage id="ui-myprofile.settings.changePassword.label" />,
      component: ChangePassword,
      perm: 'ui-myprofile.settings.change-password',
    };

    return changePasswordPageSettings;
  }

  render() {
    /* istanbul ignore if  */
    if (!this.pages.length) return null;

    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-myprofile.settings.index.paneTitle" />}
      />
    );
  }
}

export default MyProfile;
