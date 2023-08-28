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
import { forgotPasswordSchema } from '../account/accountSchema';
import { forgotPassword } from '../../../../actions/authActions';

function ForgotForm(props) {
  const [show, setShow] = useState(false);

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      await props.forgotPassword(fields);
      setShow(true);
    } catch (e) {
      setErrors(e);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: '',
  };

  return (
    <div className="form-wrapper">
      <div className="heading">
        <h4>Forgot your password?</h4>
      </div>
      <p>Enter your email and we’ll send you instructions on how to reset your password.</p>

      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
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

            <Alert variant="success" show={show}>
              We’ve sent you an email which you can use to change your password. Check your spam
              folder if you haven’t received it after a few minutes.
            </Alert>

            <Form.Row className="actions-row">
              <Col>
                <Button variant="jumbo" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                  <FontAwesomeIcon icon="chevron-right" className="ml-2" />
                </Button>
              </Col>
              <Col className="other-links">
                Go back to 
                {' '}
                <Link to="/dashboard/login">Login page</Link>
              </Col>
            </Form.Row>
          </FormikForm>
        )}
      />
    </div>
  );
}

ForgotForm.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  forgotPassword,
};

export default connect(
  null,
  mapDispatchToProps,
)(ForgotForm);
