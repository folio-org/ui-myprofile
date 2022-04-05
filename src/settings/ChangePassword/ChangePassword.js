import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  SubmissionError,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  PasswordStrength,
  TextField,
  Callout,
  Button,
  Row,
  Col,
} from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import { PasswordValidationField } from '@folio/stripes/smart-components';

import ChangePasswordForm from './ChangePasswordForm';

class ChangePassword extends Component {
  static propTypes = {
    stripes: stripesShape,
    mutator: PropTypes.shape({
      changePassword: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
  };

  static manifest = Object.freeze({
    changePassword: {
      type: 'okapi',
      path: 'bl-users/settings/myprofile/password',
      fetch: false,
      throwErrors: false,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      passwordMasked: true,
    };

    this.styles = {
      changePasswordFormWrapper: {
        width: '100%',
      },
      toggleMaskButtonWrapper: {
        marginTop: '20px',
        marginLeft: '1rem',
      },
      passwordStrengthMeter: {
        marginLeft: '1rem',
      },
    };

    this.passwordField = props.stripes.connect(PasswordValidationField);

    this.validators = {
      currentPassword: [this.requiredValidation],
      newPassword: [this.requiredValidation],
      confirmPassword: [this.requiredValidation, this.confirmPasswordValidation],
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked,
    }));
  };

  getFullUserName() {
    const {
      firstName,
      lastName,
    } = this.props.stripes.user.user;

    return {
      firstName,
      lastName,
    };
  }

  onChangePasswordFormSubmit = values => {
    const { changePassword } = this.props.mutator;
    const {
      currentPassword,
      newPassword,
    } = values;
    const {
      username,
      id: userId,
    } = this.props.stripes.user.user;

    return changePassword
      .POST({
        username,
        userId,
        password: currentPassword,
        newPassword,
      })
      .then(() => {
        if (this._isMounted) {
          this.handleChangePasswordSuccess();
        }
      })
      .catch(this.handleChangePasswordError);
  };

  handleChangePasswordSuccess = () => {
    const successMessage = (
      <FormattedMessage
        id="ui-myprofile.settings.changePassword.successfullyChanged"
        values={this.getFullUserName()}
      />
    );

    this.callout.sendCallout({ message: successMessage });
  };

  handleChangePasswordError = async response => {
    if (response.status === 400) {
      const data = await response.json();

      throw new SubmissionError({
        newPassword: this.parseErrors(data),
      });
    } else if (response.status === 401) {
      throw new SubmissionError({
        currentPassword: <FormattedMessage id="ui-myprofile.settings.changePassword.wrongPassword" />,
      });
    }
  };

  parseErrors({ errors }) {
    if (errors.length > 1) {
      return (
        <ul>
          {this.getPasswordValidationMessages(errors)}
        </ul>
      );
    }

    return <FormattedMessage id={`stripes-smart-components.${errors[0].code}`} />;
  }

  getPasswordValidationMessages(data) {
    return data.map(element => (
      <li key={`${element.code}-${element.type}`}>
        <FormattedMessage id={`stripes-smart-components.${element.code}`} />
      </li>
    ));
  }

  resetForm = (values, dispatch, { reset }) => {
    // form need to be reset inside of "onSubmitSuccess" callback in order to properly reset the "submitSucceed" flag
    reset();
  };

  requiredValidation = value => {
    if (value) return null;

    return <FormattedMessage id="ui-myprofile.settings.changePassword.enterValue" />;
  };

  confirmPasswordValidation = (value, { newPassword, confirmPassword }) => {
    const isConfirmPasswordInvalid = newPassword && confirmPassword && newPassword !== confirmPassword;

    if (!isConfirmPasswordInvalid) {
      return null;
    }

    return <FormattedMessage id="ui-myprofile.settings.changePassword.confirmPasswordMatchError" />;
  };

  createCalloutRef = ref => {
    this.callout = ref;
  };

  render() {
    const { passwordMasked } = this.state;
    const { label } = this.props;
    const passwordType = passwordMasked ? 'password' : 'text';
    const { username } = this.props.stripes.user.user;
    const passwordToggleLabelId = `ui-myprofile.settings.changePassword.${passwordMasked ? 'show' : 'hide'}Password`;

    return (
      <div
        style={this.styles.changePasswordFormWrapper}
        data-test-change-password-page
      >
        <ChangePasswordForm
          title={label}
          saveButtonText={<FormattedMessage id="ui-myprofile.settings.changePassword.save" />}
          onSubmit={this.onChangePasswordFormSubmit}
          onSubmitSuccess={this.resetForm}
        >
          <Row>
            <Col xs={6}>
              <div data-test-change-password-current-password-field>
                <Field
                  data-testid="current-password-field"
                  component={TextField}
                  type={passwordType}
                  id="current-password"
                  name="currentPassword"
                  label={<FormattedMessage id="ui-myprofile.settings.changePassword.currentPassword" />}
                  autoFocus
                  validate={this.validators.currentPassword}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div data-test-change-password-new-password-field>
                <this.passwordField
                  data-testid="new-password-field"
                  passwordMeterColProps={{
                    style: this.styles.passwordStrengthMeter,
                  }}
                  component={PasswordStrength}
                  id="new-password"
                  name="newPassword"
                  type={passwordType}
                  username={username}
                  label={<FormattedMessage id="ui-myprofile.settings.changePassword.newPassword" />}
                  validate={this.validators.newPassword}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div data-test-change-password-confirm-password-field>
                <Field
                  data-testid="confirm-password-field"
                  component={TextField}
                  type={passwordType}
                  id="confirm-password"
                  name="confirmPassword"
                  label={<FormattedMessage id="ui-myprofile.settings.changePassword.confirmPassword" />}
                  validate={this.validators.confirmPassword}
                />
              </div>
            </Col>
            <Col>
              <div
                data-test-change-password-toggle-mask-btn
                style={this.styles.toggleMaskButtonWrapper}
              >
                <Button
                  type="button"
                  buttonStyle="link"
                  onClick={this.togglePasswordMask}
                  data-testid="change-password-toggle-mask-btn"
                >
                  <FormattedMessage id={passwordToggleLabelId} />
                </Button>
              </div>
            </Col>
          </Row>
        </ChangePasswordForm>
        <Callout ref={this.createCalloutRef} />
      </div>
    );
  }
}

export default ChangePassword;
