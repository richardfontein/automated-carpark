import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';

import { authSchema } from '../account/accountSchema';
import { login } from '../../../../actions/authActions';
import LoginForm from './LoginForm';

function LoginFormWrapper(props) {
  // Get previous location of user to redirect to after login
  const {
    location: { state: { from } = { from: { pathname: '/dashboard/tenancies/general' } } },
  } = props;

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      await props.login(fields);
      props.history.push(from);
    } catch (e) {
      setErrors(e);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <div className="form-wrapper">
      <div className="heading">
        <h4>Log Into My Account</h4>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={authSchema}
        onSubmit={handleSubmit}
        render={LoginForm}
      />
    </div>
  );
}

LoginFormWrapper.propTypes = {
  location: PropTypes.shape({ state: PropTypes.object }).isRequired,
  login: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

const mapDispatchToProps = {
  login,
};

export default connect(
  null,
  mapDispatchToProps,
)(LoginFormWrapper);
