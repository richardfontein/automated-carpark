import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form as FormikForm } from 'formik';
import {
 Form, Button, Col, Alert, 
} from 'react-bootstrap';

import { Link } from 'react-router-dom';
import FormField from '../../forms/FormField';
import { resetPasswordSchema } from '../account/accountSchema';
import { resetPassword } from '../../../../actions/authActions';

function ResetForm(props) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    // Extract token from props
    const {
      match: {
        params: { resetPasswordToken },
      },
    } = props;

    // Set data as fields plus resetPasswordToken
    const data = { ...fields, resetPasswordToken };

    try {
      await props.resetPassword(data);
      props.history.push('/dashboard');
    } catch (e) {
      if (e.resetPasswordToken) {
        setMessage(e.resetPasswordToken);
        setShow(true);
      } else {
        setErrors(e);
      }
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
        <h4>Reset Your Password</h4>
      </div>
      <p>Enter your email and new password below.</p>

      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
        render={({ isSubmitting }) => (
          <FormikForm>
            <Form.Group>
              <FormField
                name="email"
                type="email"
                autoComplete="email username"
                placeholder="Email"
              />
            </Form.Group>

            <Form.Group>
              <FormField
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="New Password"
              />
            </Form.Group>

            <Alert variant="danger" show={show}>
              {message}
            </Alert>

            <Form.Row className="actions-row">
              <Col>
                <Button variant="jumbo" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  <FontAwesomeIcon icon="chevron-right" className="ml-2" />
                </Button>
              </Col>
              <Col className="other-links">
                Go back to 
                {' '}
                <Link to="/dashboard/login">Login page</Link>
                <Link to="/dashboard/forgot" className="fade-link">
                  Forgot Password?
                </Link>
              </Col>
            </Form.Row>
          </FormikForm>
        )}
      />
    </div>
  );
}

ResetForm.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  match: PropTypes.shape(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

const mapDispatchToProps = {
  resetPassword,
};

export default connect(
  null,
  mapDispatchToProps,
)(ResetForm);
