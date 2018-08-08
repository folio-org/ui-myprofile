import React from 'react';
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import Pane from '@folio/stripes-components/lib/Pane';
import stripesForm from '@folio/stripes-form';

const ChangePasswordForm = (props) => {
  const {
    handleSubmit,
    handleSubmitSuccess,
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
    <form id="change-password-form" onSubmit={handleSubmit} onSubmitSuccess={handleSubmitSuccess}>
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={title} lastMenu={lastMenu}>
        {children}
      </Pane>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleSubmitSuccess: PropTypes.func.isRequired,
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
