import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';

import { authSchema } from '../general/adminSchema';
import { adminLogin } from '../../../../actions/adminActions';
import LoginForm from './LoginForm';

function LoginFormWrapper(props) {
  // Get previous location of user to redirect to after login
  const {
    location: { state: { from } = { from: { pathname: '/admin' } } },
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
  login: adminLogin,
};

export default connect(
  null,
  mapDispatchToProps,
)(LoginFormWrapper);
