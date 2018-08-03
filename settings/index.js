import React, { Component } from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import { stripesShape } from '@folio/stripes-core/src/Stripes'; // eslint-disable-line import/no-unresolved

import ChangePassword from './ChangePassword';

class MyProfile extends Component {
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
    const { stripes: { intl: { formatMessage }, okapi: { ssoEnabled } } } = this.props;
    const showPasswordPage = !ssoEnabled;

    if (!showPasswordPage) {
      return undefined;
    }

    const changePasswordPageSettings = {
      route: 'password',
      label: formatMessage({ id: 'ui-myprofile.settings.changePassword.label' }),
      component: ChangePassword,
      perm: 'ui-myprofile.view',
    };

    return changePasswordPageSettings;
  }

  render() {
    if (!this.pages.length) return null;

    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-myprofile.settings.index.paneTitle' })}
      />
    );
  }
}

export default MyProfile;
