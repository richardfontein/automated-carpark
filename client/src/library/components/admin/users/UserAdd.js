import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik } from 'formik';
import { Button } from 'react-bootstrap';

import { adminCreateUser } from '../../../../actions/adminActions';
import { userSchema } from './userSchema';
import UserForm from './UserForm';

function UserAdd(props) {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
  };

  const handleSubmit = async (fields, { setErrors, setSubmitting }) => {
    try {
      const values = userSchema.cast(fields);
      await props.createUser(values);
      props.history.push('/admin/users');
    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="button-list">
        <LinkContainer exact to="/admin/users">
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container">
        <div className="form-wrapper">
          <div className="heading">
            <h4>Enter user details below</h4>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={handleSubmit}
            render={formProps => <UserForm {...formProps} />}
          />
        </div>
      </div>
    </>
  );
}

UserAdd.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  createUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = { createUser: adminCreateUser };

export default connect(
  null,
  mapDispatchToProps,
)(UserAdd);
