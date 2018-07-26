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

    this.pages = [
      {
        route: 'password',
        label: this.props.stripes.intl.formatMessage({ id: 'ui-myprofile.settings.changePassword' }),
        component: ChangePassword,
        perm: 'ui-myprofile.view',
      },
    ];
  }

  render() {
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
