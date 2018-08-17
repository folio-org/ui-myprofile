import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';

const Recaptcha = (props) => {
  // disable recaptcha for testing as it is unable to simulate it in tests
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  const {
    input,
    refName,
    siteKey = '6LdpJmkUAAAAACPqv1O2YJRHsNoaLSKzjAxPZmkM',
    locale = 'en'
  } = props;

  // this is the way to set options for recaptcha like locale
  window.recaptchaOptions = {
    lang: locale,
    useRecaptchaNet: true,
    removeOnMount: true,
  };

  return (
    <ReCAPTCHA
      ref={refName}
      sitekey={siteKey}
      onChange={input.onChange}
    />
  );
};

Recaptcha.propTypes = {
  refName: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  siteKey: PropTypes.string.isRequired,
  locale: PropTypes.string,
};

export default Recaptcha;
