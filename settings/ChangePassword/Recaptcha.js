import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import injectIntl from '@folio/stripes-components/lib/InjectIntl';
import reduxFormField from '@folio/stripes-components/lib/ReduxFormField';

import formStyles from '@folio/stripes-components/lib/sharedStyles/form.css';

const recapthaStyles = {
  wrapper: { marginBottom: '0.4rem' },
};

const Recaptcha = (props) => {
  // disable recaptcha for testing as it is unable to simulate it in tests
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  const {
    error,
    refName,
    siteKey = '6LdpJmkUAAAAACPqv1O2YJRHsNoaLSKzjAxPZmkM',
    locale = 'en',
    onChange,
  } = props;

  // this is the way to set options for recaptcha like locale
  window.recaptchaOptions = {
    lang: locale,
    useRecaptchaNet: true,
    removeOnMount: true,
  };

  const errorElement = error ? (
    <div className={formStyles.feedbackError}>{error}</div>
  ) : null;

  return (
    <div>
      <div style={recapthaStyles.wrapper}>
        <ReCAPTCHA
          ref={refName}
          sitekey={siteKey}
          onChange={onChange}
        />
      </div>
      {errorElement}
    </div>
  );
};

Recaptcha.propTypes = {
  refName: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  siteKey: PropTypes.string,
  locale: PropTypes.string,
};

export default reduxFormField(
  injectIntl(
    Recaptcha, { withRef: true }
  ), ({ input, meta }) => ({
    dirty: meta.dirty,
    error: (meta.touched && meta.error ? meta.error : ''),
    loading: meta.asyncValidating,
    name: input.name,
    onChange: input.onChange,
    touched: meta.touched,
    valid: meta.valid,
    value: input.value,
  })
);
