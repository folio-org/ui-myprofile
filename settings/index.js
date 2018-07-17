import React, { Component } from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import { stripesShape } from '@folio/stripes-core/src/Stripes'; // eslint-disable-line import/no-unresolved

class MyProfile extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  render() {
    const { stripes } = this.props;

    return (
      <Settings
        {...this.props}
        paneTitle={stripes.intl.formatMessage({ id: 'ui-myprofile.settings.index.paneTitle' })}
      />
    );
  }
}

export default MyProfile;
