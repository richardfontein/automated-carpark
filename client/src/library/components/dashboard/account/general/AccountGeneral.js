import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import Notification from '../../../notifications/Notification';
import { updateUser } from '../../../../../actions/authActions';
import { updateUserSchema } from '../accountSchema';
import AccountGeneralForm from './AccountGeneralForm';

function AccountGeneral(props) {
  const { user } = props;

  // Notification handlers
  const [notification, setNotification] = useState({
    show: false,
    success: true,
  });
  const handleClose = () => {
    setNotification({ ...notification, show: false });
  };

  const handleSubmit = (fields, { setSubmitting, setErrors }) => {
    props
      .updateUser(fields)
      .then(() => setNotification({ show: true, success: true, message: 'Saved' }))
      .catch((e) => {
        setErrors(e);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={user}
        validationSchema={updateUserSchema}
        onSubmit={handleSubmit}
        render={AccountGeneralForm}
      />
      <Notification
        show={notification.show}
        variant={notification.success ? 'success' : 'danger'}
        onClose={handleClose}
      >
        {notification.message}
      </Notification>
    </>
  );
}

AccountGeneral.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = { updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountGeneral);
