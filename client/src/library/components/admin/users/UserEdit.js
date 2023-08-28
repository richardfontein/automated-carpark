import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import { Button } from 'react-bootstrap';

import { userSchema } from './userSchema';
import UserForm from './UserForm';

function UserEdit(props) {
  const { user } = props;

  const initialValues = user;

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      const values = userSchema.cast(fields);
      await props.updateUser(values);
      props.history.push(`/admin/users/${user.id}`);
    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="button-list">
        <LinkContainer to={`/admin/users/${user.id}`}>
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container">
        <div className="form-wrapper">
          <div className="heading">
            <h4>Update user details below</h4>
          </div>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={(values) => {
              try {
                validateYupSchema(values, userSchema, true, initialValues);
              } catch (err) {
                return yupToFormErrors(err);
              }

              return {};
            }}
            onSubmit={handleSubmit}
            render={formProps => <UserForm {...formProps} />}
          />
        </div>
      </div>
    </>
  );
}

UserEdit.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    corporateCarparks: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserEdit;
