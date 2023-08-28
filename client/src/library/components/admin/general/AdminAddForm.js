import React from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';

import FormField from '../../forms/FormField';

export default function AdminForm({ initialValues, isSubmitting }) {
  /* Conditionally render Action buttons based on admin state */
  const submitButtonText = initialValues ? 'Save Admin' : 'Add Admin';
  const SubmitButton = (
    <Col>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Loading...' : submitButtonText}
      </Button>
    </Col>
  );

  return (
    <FormikForm autoComplete="off">
      <Form.Row>
        <Form.Group as={Col}>
          <FormField name="firstName" placeholder="First Name" />
        </Form.Group>

        <Form.Group as={Col}>
          <FormField name="lastName" placeholder="Last Name" />
        </Form.Group>
      </Form.Row>

      <Form.Group>
        <FormField name="email" type="email" placeholder="Email" />
      </Form.Group>

      <Form.Group>
        <FormField name="company" placeholder="Company" />
      </Form.Group>

      <Form.Group>
        <FormField name="password" type="password" autoComplete="off" placeholder="Password" />
      </Form.Group>

      <Form.Row>{SubmitButton}</Form.Row>
    </FormikForm>
  );
}

AdminForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    company: PropTypes.string,
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
