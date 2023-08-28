import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
 Field, ErrorMessage, connect, getIn, 
} from 'formik';
import DatePicker from 'react-datepicker';
import { isMobile } from 'react-device-detect';
import { format as formatDate } from 'date-fns';

function FormDatepicker(props) {
  const {
    name,
    placeholder,
    minDate,
    maxDate,
    popperPlacement,
    disabled,
    formik: {
 errors, touched, values, setFieldValue, 
},
  } = props;

  /* Connect to Formik Context Consumer */
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const value = getIn(values, name);

  /* Renders a read-only input to prevent text input on mobile devices */
  const MobileInput = forwardRef((inputProps, ref) => (
    <input
      {...inputProps}
      ref={ref}
      value={value ? formatDate(value, 'dd/MM/yyyy') : ''}
      readOnly
    />
  ));

  const handleChange = (e) => {
    setFieldValue(name, e);
  };
  return (
    <>
      <Field
        name={name}
        type="text"
        render={() => (
          <DatePicker
            selected={value}
            placeholderText={placeholder}
            onChange={handleChange}
            dateFormat={[
              'dd/MM/yyyy',
              'dd/MM/yy',
              'dd.MM.yyyy',
              'dd.MM.yy',
              'dd-MM-yyyy',
              'dd-MM-yy',
            ]}
            minDate={minDate}
            maxDate={maxDate}
            disabledKeyboardNavigation
            isClearable={!disabled}
            popperPlacement={popperPlacement}
            disabled={disabled}
            className={`form-control${error && touch ? ' is-invalid' : ''}`}
            /* Mobile rendering options */
            customInput={isMobile ? <MobileInput /> : null}
            withPortal={isMobile}
          />
        )}
      />
      <ErrorMessage
        name={name}
        component="div"
        className={`invalid-feedback${error && touch ? ' invalid-datepicker' : ''}`}
      />
    </>
  );
}

export default connect(FormDatepicker);

FormDatepicker.defaultProps = {
  placeholder: '',
  minDate: null,
  maxDate: null,
  popperPlacement: 'top-end',
  disabled: false,
};

FormDatepicker.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  popperPlacement: PropTypes.string,
  disabled: PropTypes.bool,
  formik: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
