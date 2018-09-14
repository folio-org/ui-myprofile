import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, SubmissionError } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Callout from '@folio/stripes-components/lib/Callout';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { stripesShape } from '@folio/stripes-core/src/Stripes'; // eslint-disable-line import/no-unresolved

import ChangePasswordForm from './ChangePasswordForm';

class ChangePassword extends Component {
  static manifest = Object.freeze({
    changePassword: {
      type: 'okapi',
      path: 'authn/update',
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
    this.styles = {
      changePasswordFormWrapper: {
        width: '100%',
      },
      toggleMaskButtonWrapper: {
        marginTop: '20px',
      },
    };
  }

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked
    }));
  };

  getFullUserName() {
    const { firstName, lastName } = this.props.stripes.user.user;

    return { firstName, lastName };
  }

  onChangePasswordFormSubmit = (values) => {
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
      <SafeHTMLMessage
        id={`${this.translateNamespace}.successfullyChanged`}
        values={this.getFullUserName()}
      />
    );

    this.callout.sendCallout({ message: successMessage });
  };

  handleChangePasswordError = err => {
    const isWrongCurrentPassword = err.status === 401;

    if (isWrongCurrentPassword) {
      throw new SubmissionError({
        currentPassword: this.translate('wrongPassword')
      });
    }
  };

  resetForm = (values, dispatch, { reset }) => {
    // form need to be reset inside of "onSubmitSuccess" callback in order to properly reset the "submitSucceed" flag
    reset();
  };

  validateForm = values => {
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

    const isConfirmPasswordInvalid = (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword !== values.confirmPassword
    );

    if (isConfirmPasswordInvalid) {
      const confirmPasswordMatchError = this.translate('confirmPasswordMatchError');

      errors.confirmPassword = confirmPasswordMatchError;
    }

    return errors;
  };

  translate = id => {
    const { stripes } = this.props;
    const { intl: { formatMessage } } = stripes;

    return formatMessage({ id: `${this.translateNamespace}.${id}` });
  };

  createCalloutRef = ref => { this.callout = ref; };

  render() {
    const { passwordMasked } = this.state;
    const { label } = this.props;
    const passwordType = passwordMasked ? 'password' : 'text';
    const passwordToggleLabelId = `${this.translateNamespace}.${passwordMasked ? 'show' : 'hide'}Password`;

    return (
      <div
        style={this.styles.changePasswordFormWrapper}
        data-test-change-password-page
      >
        <ChangePasswordForm
          title={label}
          validate={this.validateForm}
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
                  autoFocus
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div data-test-change-password-new-password-field>
                <Field
                  component={TextField}
                  type={passwordType}
                  id="new-password"
                  name="newPassword"
                  label={this.translate('newPassword')}
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
