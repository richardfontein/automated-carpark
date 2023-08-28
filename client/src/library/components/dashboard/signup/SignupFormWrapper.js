import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { registerUser } from '../../../../actions/authActions';
import SignupForm from './SignupForm';
import { createUserSchema } from '../account/accountSchema';

function SignupFormWrapper(props) {
  const handleSubmit = (fields, { setSubmitting, setErrors }) => {
    props
      .registerUser(fields)
      .then(() => props.history.push('/dashboard/tenancies/general'))
      .catch(err => setErrors(err))
      .finally(() => setSubmitting(false));
  };

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
  };

  return (
    <div className="form-wrapper">
      <div className="heading">
        <h4>Sign up for free</h4>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={createUserSchema}
        onSubmit={handleSubmit}
        render={SignupForm}
      />
    </div>
  );
}

SignupFormWrapper.propTypes = {
  registerUser: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

const mapDispatchToProps = {
  registerUser,
};

export default connect(
  null,
  mapDispatchToProps,
)(SignupFormWrapper);
