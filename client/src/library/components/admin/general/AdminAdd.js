import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik } from 'formik';
import { Button } from 'react-bootstrap';

import { adminCreateUser } from '../../../../actions/adminActions';
import { adminAddSchema } from './adminSchema';
import AdminAddForm from './AdminAddForm';

function AdminAdd(props) {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
  };

  const handleSubmit = async (fields, { setErrors, setSubmitting }) => {
    try {
      const values = adminAddSchema.cast(fields);
      const data = { ...values, role: 'administrator' };
      await props.createUser(data);
      props.history.push('/admin/general');
    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="button-list">
        <LinkContainer exact to="/admin/general">
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container">
        <div className="form-wrapper">
          <div className="heading">
            <h4>Enter admin details below</h4>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={adminAddSchema}
            onSubmit={handleSubmit}
            render={formProps => <AdminAddForm Form {...formProps} />}
          />
        </div>
      </div>
    </>
  );
}

AdminAdd.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  createUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = { createUser: adminCreateUser };

export default connect(
  null,
  mapDispatchToProps,
)(AdminAdd);
