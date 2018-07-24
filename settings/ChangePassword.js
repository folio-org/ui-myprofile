import React, { Component } from 'react';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import { stripesShape } from '@folio/stripes-core/src/Stripes'; // eslint-disable-line import/no-unresolved

class ChangePassword extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  render() {
    return (
      <Paneset>
        <Pane
          defaultWidth="100%"
          paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-myprofile.settings.changePassword' })}
        />
      </Paneset>
    );
  }
}

export default ChangePassword;
