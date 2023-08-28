import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import { Button } from 'react-bootstrap';

import { adminEditSchema } from './adminSchema';
import AdminEditForm from './AdminEditForm';

import { getAdministrator, adminUpdateUser } from '../../../../actions/adminActions';

function AdminEdit(props) {
  const {
    loadUser,
    match: {
      params: { id },
    },
  } = props;

  const user = loadUser(parseInt(id, 10));

  const initialValues = user || {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
  };

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      const values = adminEditSchema.cast(fields);
      await props.updateUser(values);
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
        <LinkContainer to="/admin/general">
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container">
        <div className="form-wrapper">
          <div className="heading">
            <h4>Update admin details below</h4>
          </div>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={(values) => {
              try {
                validateYupSchema(values, adminEditSchema, true, initialValues);
              } catch (err) {
                return yupToFormErrors(err);
              }

              return {};
            }}
            onSubmit={handleSubmit}
            render={formProps => <AdminEditForm {...formProps} />}
          />
        </div>
      </div>
    </>
  );
}

AdminEdit.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  loadUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  match: PropTypes.shape(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

const mapStateToProps = state => ({
  loadUser: getAdministrator(state),
});

const mapDispatchToProps = {
  updateUser: adminUpdateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminEdit);
