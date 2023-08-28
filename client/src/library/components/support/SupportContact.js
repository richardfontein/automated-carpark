import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';
import { Form, Button, Alert } from 'react-bootstrap';

import FormField from '../forms/FormField';
import FormFieldSelect from '../forms/FormFieldSelect';
import { sendContactQuery } from '../../../actions/contactActions';

const contactValidationSchema = Yup.object().shape({
  subject: Yup.string().required('Please select your type of inquiry.'),
  email: Yup.string()
    .required('Please enter your email address.')
    .email('Invalid email address.'),
  message: Yup.string()
    .required('Please enter a message.')
    .max(2000, '2000 characters maximum.'),
});

function SupportContact(props) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (fields, { setSubmitting, resetForm }) => {
    try {
      setShow(false);
      await props.sendContactQuery(fields);
      setMessage(
        'Thank you, we have received your message. We will get back to you as soon as possible.',
      );
      setShow(true);
      setStatus('success');
      resetForm();
    } catch (e) {
      if (e && e.form) {
        setMessage(e.form);
      } else {
        setMessage('Something went wrong. Please try again later.');
      }

      setShow(true);
      setStatus('danger');
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    subject: 'Corporate Parking',
    email: '',
    message: '',
  };

  return (
    <div>
      <div className="heading">
        <h2>Contact Us</h2>
      </div>
      <p>
        We do our best to respond to each query with a personalised reply within
        {' '}
        <strong>1-2 business days.</strong>
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={contactValidationSchema}
        onSubmit={handleSubmit}
        render={({ isSubmitting }) => (
          <FormikForm>
            <Form.Group>
              <Form.Label>What do you need help with?</Form.Label>
              <FormFieldSelect
                name="subject"
                options={[
                  'Corporate Parking',
                  'Pricing & Plans',
                  'Account or Billing',
                  'Carpark Termination',
                  'Other',
                ]}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Your email:</Form.Label>
              <FormField name="email" type="email" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Message:</Form.Label>
              <FormField name="message" component="textarea" />
            </Form.Group>

            <Alert variant={status} show={show}>
              {message}
            </Alert>

            <Form.Group className="actions-row">
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Form.Group>
          </FormikForm>
        )}
      />
    </div>
  );
}

SupportContact.propTypes = {
  sendContactQuery: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  sendContactQuery,
};

export default connect(
  null,
  mapDispatchToProps,
)(SupportContact);
