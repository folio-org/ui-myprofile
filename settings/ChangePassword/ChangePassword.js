import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Callout from '@folio/stripes-components/lib/Callout';
import ConfigForm from '@folio/stripes-smart-components/lib/ConfigManager/ConfigForm';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

import styles from './ChangePassword.css';

class ChangePassword extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      intl: PropTypes.shape({
        formatMessage: PropTypes.func,
      }),
      user: PropTypes.shape({
        user: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
      })
    }),
    label: PropTypes.string.isRequired
  };

  state = {
    passwordMasked: true,
  };

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({ passwordMasked: !passwordMasked }));
  };

  getUserName() {
    const { user: { user: { firstName, lastName } } } = this.props.stripes;

    return { firstName, lastName };
  }

  onSave = () => {
    const userName = this.getUserName();

    const successMessage = (
      <SafeHTMLMessage
        id="ui-myprofile.settings.changePassword.successfullyChanged"
        values={userName}
      />
    );

    this.callout.sendCallout({ message: successMessage });
  };

  translate = (id) => {
    const { stripes } = this.props;
    const { intl: { formatMessage } } = stripes;

    return formatMessage({ id: `ui-myprofile.settings.changePassword.${id}` });
  };

  validate = (values) => {
    const errors = {};
    const enterValueError = this.translate('enterValue');

    if (!values.currentPassword) {
      errors.currentPassword = enterValueError;
    }

    if (!values.newPassword) {
      errors.newPassword = enterValueError;
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = enterValueError;
    }

    if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
      const confirmPasswordMatchError = this.translate('confirmPasswordMatchError');

      errors.confirmPassword = confirmPasswordMatchError;
    }

    return errors;
  };

  render() {
    const { passwordMasked } = this.state;
    const { label } = this.props;
    const passwordType = passwordMasked ? 'password' : 'text';
    const passwordToggleLabelId = `ui-myprofile.settings.changePassword.${passwordMasked ? 'show' : 'hide'}Password`;

    return (
      <div className={styles['change-password-wrap']}>
        <ConfigForm
          onSubmit={this.onSave}
          label={label}
          validate={this.validate}
        >
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                type={passwordType}
                id="current-password"
                name="currentPassword"
                label={this.translate('currentPassword')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                type={passwordType}
                id="new-password"
                name="newPassword"
                label={this.translate('newPassword')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                type={passwordType}
                id="confirm-password"
                name="confirmPassword"
                label={this.translate('confirmPassword')}
                required
              />
            </Col>
            <Col>
              <Button
                type="button"
                buttonStyle="link"
                buttonClass={styles['change-password-btn']}
                onClick={this.togglePasswordMask}
              >
                <FormattedMessage id={passwordToggleLabelId} />
              </Button>
            </Col>
          </Row>
        </ConfigForm>
        <Callout ref={(ref) => { this.callout = ref; }} />
      </div>
    );
  }
}

export default ChangePassword;
