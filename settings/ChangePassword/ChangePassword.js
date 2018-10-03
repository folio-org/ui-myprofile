import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, SubmissionError } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { TextField, Callout, Button, Row, Col } from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import { PasswordStrength, PasswordValidationField } from '@folio/stripes/smart-components';

import ChangePasswordForm from './ChangePasswordForm';

class ChangePassword extends Component {
  static manifest = Object.freeze({
    changePassword: {
      type: 'okapi',
      path: 'bl-users/settings/myprofile/password',
      fetch: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    stripes: stripesShape,
    mutator: PropTypes.shape({
      changePassword: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      passwordMasked: true,
    };

    this.translateNamespace = 'ui-myprofile.settings.changePassword';
    this.translatePasswordValidationNamespace = 'stripes-smart-components';
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

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked,
    }));
  };

  getFullUserName() {
    const { firstName, lastName } = this.props.stripes.user.user;

    return { firstName, lastName };
  }

  onChangePasswordFormSubmit = values => {
    const { changePassword } = this.props.mutator;
    const { currentPassword, newPassword } = values;
    const { username, id: userId } = this.props.stripes.user.user;

    return changePassword
      .POST({
        username,
        userId,
        password: currentPassword,
        newPassword,
      })
      .then(() => {
        this.handleChangePasswordSuccess();
      })
      .catch(this.handleChangePasswordError);
  };

  handleChangePasswordSuccess = () => {
    const successMessage = (
      <SafeHTMLMessage id={`${this.translateNamespace}.successfullyChanged`} values={this.getFullUserName()} />
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
        currentPassword: this.translate('wrongPassword'),
      });
    }
  };

  parseErrors({ errors }) {
    return errors.length > 1 ? (
      <ul>{this.getPasswordValidationMessages(errors)}</ul>
    ) : (
      this.translate(errors[0].code, this.translatePasswordValidationNamespace)
    );
  }

  getPasswordValidationMessages(data) {
    return data.map(element => (
      <li key={`${element.code}-${element.type}`}>
        {this.translate(element.code, this.translatePasswordValidationNamespace)}
      </li>
    ));
  }

  resetForm = (values, dispatch, { reset }) => {
    // form need to be reset inside of "onSubmitSuccess" callback in order to properly reset the "submitSucceed" flag
    reset();
  };

  requiredValidation = value => {
    const enterValueError = this.translate('enterValue');

    return value ? undefined : enterValueError;
  };

  confirmPasswordValidation = (value, { newPassword, confirmPassword }) => {
    const isConfirmPasswordInvalid = newPassword && confirmPassword && newPassword !== confirmPassword;

    if (isConfirmPasswordInvalid) {
      const confirmPasswordMatchError = this.translate('confirmPasswordMatchError');

      return confirmPasswordMatchError;
    }

    return undefined;
  };

  translate = (id, namespace = this.translateNamespace) => {
    const { stripes } = this.props;
    const {
      intl: { formatMessage },
    } = stripes;

    return formatMessage({ id: `${namespace}.${id}` });
  };

  createCalloutRef = ref => {
    this.callout = ref;
  };

  render() {
    const { passwordMasked } = this.state;
    const { label } = this.props;
    const passwordType = passwordMasked ? 'password' : 'text';
    const { username } = this.props.stripes.user.user;
    const passwordToggleLabelId = `${this.translateNamespace}.${passwordMasked ? 'show' : 'hide'}Password`;

    return (
      <div style={this.styles.changePasswordFormWrapper} data-test-change-password-page>
        <ChangePasswordForm
          title={label}
          saveButtonText={this.translate('save')}
          onSubmit={this.onChangePasswordFormSubmit}
          onSubmitSuccess={this.resetForm}
        >
          <Row>
            <Col xs={6}>
              <div data-test-change-password-current-password-field>
                <Field
                  component={TextField}
                  type={passwordType}
                  id="current-password"
                  name="currentPassword"
                  label={this.translate('currentPassword')}
                  validate={this.validators.currentPassword}
                  autoFocus
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div data-test-change-password-new-password-field>
                <Field
                  passwordMeterColProps={{
                    style: this.styles.passwordStrengthMeter,
                  }}
                  component={PasswordStrength}
                  id="new-password"
                  name="newPassword"
                  type={passwordType}
                  username={username}
                  label={this.translate('newPassword')}
                  validate={this.validators.newPassword}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div data-test-change-password-confirm-password-field>
                <Field
                  component={TextField}
                  type={passwordType}
                  id="confirm-password"
                  name="confirmPassword"
                  label={this.translate('confirmPassword')}
                  validate={this.validators.confirmPassword}
                />
              </div>
            </Col>
            <Col>
              <div data-test-change-password-toggle-mask-btn style={this.styles.toggleMaskButtonWrapper}>
                <Button type="button" buttonStyle="link" onClick={this.togglePasswordMask}>
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
