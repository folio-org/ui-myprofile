import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Pane,
  PaneFooter,
} from '@folio/stripes/components';
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

  const footer = (
    <PaneFooter
      renderEnd={(
        <Button
          id="change-password-submit-btn"
          type="submit"
          buttonStyle="primary paneHeaderNewButton"
          disabled={(pristine || submitting)}
          marginBottom0
        >
          {saveButtonText}
        </Button>
      )}
    />
  );

  return (
    <Pane
      defaultWidth="fill"
      fluidContentWidth
      paneTitle={title}
      footer={footer}
    >
      <form
        id="change-password-form"
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </Pane>
  );
};

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  title: PropTypes.node,
  saveButtonText: PropTypes.node,
  children: PropTypes.node,
};

export default stripesForm({
  form: 'changePasswordForm',
  navigationCheck: true,
  enableReinitialize: true,
})(ChangePasswordForm);
