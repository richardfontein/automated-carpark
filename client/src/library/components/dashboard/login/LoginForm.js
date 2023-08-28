import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form as FormikForm } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import FormField from '../../forms/FormField';

export default function LoginForm({ isSubmitting }) {
  return (
    <FormikForm>
      <Form.Group>
        <FormField name="email" placeholder="Email" autoComplete="email username" type="email" />
      </Form.Group>

      <Form.Group>
        <FormField
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          type="password"
        />
      </Form.Group>

      <Form.Row className="actions-row">
        <Col>
          <Button variant="jumbo" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
            <FontAwesomeIcon icon="chevron-right" className="ml-2" />
          </Button>
        </Col>
        <Col className="other-links">
          <Link to="/dashboard/signup" className="fade-link">
            Don’t have an account?
          </Link>
          <Link to="/dashboard/forgot" className="fade-link">
            Forgot Password?
          </Link>
        </Col>
      </Form.Row>
    </FormikForm>
  );
}

LoginForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
};
