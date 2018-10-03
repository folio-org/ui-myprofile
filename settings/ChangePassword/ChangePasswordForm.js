import React from 'react';
import PropTypes from 'prop-types';
import { Button, Pane } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

const ChangePasswordForm = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    title,
    saveButtonText,
    children,
  } = props;

  const lastMenu = (
    <Button
      id="change-password-submit-btn"
      type="submit"
      buttonStyle="primary paneHeaderNewButton"
      disabled={(pristine || submitting)}
      marginBottom0
    >
      {saveButtonText}
    </Button>
  );

  return (
    <form id="change-password-form" onSubmit={handleSubmit}>
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={title} lastMenu={lastMenu}>
        {children}
      </Pane>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  title: PropTypes.string,
  saveButtonText: PropTypes.string,
  children: PropTypes.node,
};

export default stripesForm({
  form: 'changePasswordForm',
  navigationCheck: true,
  enableReinitialize: true,
})(ChangePasswordForm);
