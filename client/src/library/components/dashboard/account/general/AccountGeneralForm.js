import React from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';

import FormField from '../../../forms/FormField';

const AccountInfoForm = ({ isSubmitting }) => (
  <FormikForm>
    <Form.Row>
      <Form.Group as={Col}>
        <div className="heading">
          <h3>Account Info</h3>
        </div>
      </Form.Group>

      <Form.Group as={Col} className="text-right">
        <Button variant="success" type="submit">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>First Name:</Form.Label>
        <FormField name="firstName" autoComplete="given-name" />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>Last Name:</Form.Label>
        <FormField name="lastName" autoComplete="family-name" />
      </Form.Group>
    </Form.Row>

    <Form.Group>
      <Form.Label>Email:</Form.Label>
      <FormField name="email" autoComplete="email username" />
    </Form.Group>

    <Form.Row className="divider">
      <Form.Group as={Col}>
        <div className="heading">
          <h3>Profile Info</h3>
        </div>
      </Form.Group>

      <Form.Group as={Col} className="text-right">
        <Button variant="success" type="submit">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form.Group>
    </Form.Row>

    <Form.Group>
      <Form.Label>Company:</Form.Label>
      <FormField name="company" autoComplete="organization" />
    </Form.Group>
  </FormikForm>
);

AccountInfoForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
};

export default AccountInfoForm;
