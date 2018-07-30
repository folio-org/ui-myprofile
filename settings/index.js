import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Settings from '@folio/stripes-components/lib/Settings';
import { stripesShape } from '@folio/stripes-core/src/Stripes'; // eslint-disable-line import/no-unresolved

import ChangePassword from './ChangePassword';

class MyProfile extends Component { // eslint-disable-line react/no-deprecated
  static propTypes = {
    stripes: stripesShape.isRequired,
    resources: PropTypes.shape({
      creds: PropTypes.object
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.pages = [
      {
        route: 'password',
        label: this.props.stripes.intl.formatMessage({ id: 'ui-myprofile.settings.changePassword.label' }),
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
