import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Pane,
  PaneFooter,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import css from './ChangePasswordForm.css';

const ChangePasswordForm = (props) => {
  const {
    handleSubmit,
    submitting,
    title,
    saveButtonText,
    children,
    valid,
    anyTouched,
  } = props;

  const footer = (
    <PaneFooter
      renderEnd={(
        <Button
          id="change-password-submit-btn"
          type="submit"
          buttonStyle="primary paneHeaderNewButton"
          disabled={!valid || !anyTouched || submitting}
          marginBottom0
        >
          {saveButtonText}
        </Button>
      )}
    />
  );

  return (
    <form
      id="change-password-form"
      className={css.changePasswordForm}
      onSubmit={handleSubmit}
    >
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={title}
        footer={footer}
      >
        {children}
      </Pane>
    </form>
  );
};

ChangePasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  title: PropTypes.node,
  saveButtonText: PropTypes.node,
  children: PropTypes.node,
  valid: PropTypes.bool,
  anyTouched: PropTypes.bool,
};

export default stripesForm({
  form: 'changePasswordForm',
  navigationCheck: true,
  enableReinitialize: true,
})(ChangePasswordForm);
