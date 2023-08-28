import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form as FormikForm } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import FormField from '../../forms/FormField';

export default function SignupForm({ isSubmitting }) {
  return (
    <FormikForm>
      <Form.Row>
        <Form.Group as={Col}>
          <FormField name="firstName" placeholder="First Name" autoComplete="given-name" />
        </Form.Group>

        <Form.Group as={Col}>
          <FormField name="lastName" placeholder="Last Name" autoComplete="family-name" />
        </Form.Group>
      </Form.Row>

      <Form.Group>
        <FormField name="email" type="email" autoComplete="email username" placeholder="Email" />
      </Form.Group>

      <Form.Group>
        <FormField
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          type="password"
        />
      </Form.Group>

      <Form.Group>
        <FormField name="company" placeholder="Company" autoComplete="organization" />
      </Form.Group>

      <p className="terms">
        Signing up for an Automated Carpark account means you agree to the
        {' '}
        <Link to="/terms">Terms of Service.</Link>
      </p>

      <Form.Row className="actions-row">
        <Col>
          <Button variant="jumbo" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Create Account'}
            <FontAwesomeIcon icon="chevron-right" className="ml-2" />
          </Button>
        </Col>
        <Col className="other-links">
          <Link to="/dashboard/login" className="fade-link">
            Have an account?
          </Link>
        </Col>
      </Form.Row>
    </FormikForm>
  );
}

SignupForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
};
