import React from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';

import FormField from '../../../forms/FormField';

const AccountPasswordForm = ({ isSubmitting }) => (
  <FormikForm>
    <Form.Row>
      <Form.Group as={Col}>
        <div className="heading">
          <h3>Change Password</h3>
        </div>
      </Form.Group>

      <Form.Group as={Col} className="text-right">
        <Button variant="success" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </Button>
      </Form.Group>
    </Form.Row>

    <FormField name="email" autoComplete="email username" type="text" style={{ display: 'none' }} />

    <Form.Group>
      <Form.Label>Current Password:</Form.Label>
      <FormField name="currentPassword" autoComplete="current-password" type="password" />
    </Form.Group>

    <Form.Group>
      <Form.Label>New Password:</Form.Label>
      <FormField name="newPassword" autoComplete="new-password" type="password" />
    </Form.Group>
  </FormikForm>
);

AccountPasswordForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
};

export default AccountPasswordForm;
