import React from 'react';
import PropTypes from 'prop-types';

import {
 Field, ErrorMessage, connect, getIn, 
} from 'formik';

function FormFieldSelect({
  formik: { errors, touched, setFieldValue },
  name,
  options,
  disabled,
  onChange,
}) {
  /* Connect to Formik Context Consumer */
  const error = getIn(errors, name);
  const touch = getIn(touched, name);

  return (
    <>
      <Field
        name={name}
        component="select"
        disabled={disabled}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        className={`form-control${error && touch ? ' is-invalid' : ''}`}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Field>
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </>
  );
}

export default connect(FormFieldSelect);

FormFieldSelect.defaultProps = {
  options: {},
  disabled: false,
  onChange: null,
};

FormFieldSelect.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
