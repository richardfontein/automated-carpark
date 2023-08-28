import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, getIn } from 'formik';
import { CardElement } from 'react-stripe-elements';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#495057',
    },
  },
};

function FormFieldCard({
  name,
  formik: {
 errors, touched, submitCount, setFieldValue, setFieldError, setFieldTouched, 
},
}) {
  const error = getIn(errors, name);
  const touch = getIn(touched, name);

  useEffect(() => {
    if (submitCount > 0) {
      setFieldTouched('card', true);
    }
  }, [submitCount, setFieldTouched]);

  const handleChange = (status) => {
    if (status.error) {
      setFieldError('card', status.error.message);
    } else if (status.empty) {
      setFieldValue('card', undefined);
    } else {
      setFieldValue('card', true);
    }
  };

  const handleBlur = () => {
    setFieldTouched('card', true);
  };

  return (
    <>
      <CardElement
        className={`StripeElement form-control${error && touch ? ' is-invalid' : ''}`}
        onChange={handleChange}
        onBlur={handleBlur}
        {...CARD_ELEMENT_OPTIONS}
      />
      <div className="invalid-feedback" style={{ display: error ? 'block' : 'none' }}>
        {touch && error ? error : ''}
      </div>
    </>
  );
}

FormFieldCard.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    submitCount: PropTypes.number.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    setFieldError: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(FormFieldCard);
