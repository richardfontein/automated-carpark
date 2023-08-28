import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Notification from '../../../notifications/Notification';
import AccountPasswordForm from './AccountPasswordForm';
import { updatePassword } from '../../../../../actions/authActions';

function AccountPassword(props) {
  const { email } = props;
  const initialValues = {
    email,
    currentPassword: '',
    newPassword: '',
  };

  const [notification, setNotification] = useState({
    show: false,
    isSuccessful: true,
  });

  const handleClose = () => {
    setNotification({ show: false, isSuccessful: notification.isSuccessful });
  };

  const handleSubmit = async (fields, { resetForm, setErrors, setSubmitting }) => {
    try {
      await props.updatePassword(fields);
      resetForm();
      setNotification({
        show: true,
        isSuccessful: true,
        message: 'Password saved',
      });
    } catch (error) {
      setErrors(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Remove password from validation schema
  const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Please enter your current password.')
      .min(6, 'Password must be at least 6 characters long.')
      .max(256, 'Maximum length is 256 characters.'),
    newPassword: Yup.string()
      .required('Please enter a new password.')
      .min(6, 'Password must be at least 6 characters long.')
      .max(256, 'Maximum length is 256 characters.'),
  });

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={passwordValidationSchema}
        onSubmit={handleSubmit}
        render={AccountPasswordForm}
      />
      <Notification
        show={notification.show}
        variant={notification.isSuccessful ? 'success' : 'danger'}
        onClose={handleClose}
      >
        {notification.message}
      </Notification>
    </>
  );
}
const mapStateToProps = state => ({
  email: state.auth.user.email,
});

AccountPassword.propTypes = {
  email: PropTypes.string.isRequired,
  updatePassword: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updatePassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPassword);
