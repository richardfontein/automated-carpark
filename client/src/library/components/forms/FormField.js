import React from 'react';
import PropTypes from 'prop-types';
import {
 Field, ErrorMessage, connect, getIn, 
} from 'formik';

function FormField(props) {
  const {
    name,
    placeholder,
    type,
    autoComplete,
    component,
    disabled,
    formik: { errors, touched },
    ...rest
  } = props;

  /* Connect to Formik Context Consumer */
  const error = getIn(errors, name);
  const touch = getIn(touched, name);

  return (
    <>
      <Field
        name={name}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        component={component}
        disabled={disabled}
        className={`form-control${error && touch ? ' is-invalid' : ''}`}
        {...rest}
      />
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </>
  );
}

FormField.defaultProps = {
  placeholder: '',
  component: 'input',
  autoComplete: null,
  type: 'text',
  disabled: false,
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  component: PropTypes.string,
  autoComplete: PropTypes.string,
  formik: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
  }).isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default connect(FormField);
