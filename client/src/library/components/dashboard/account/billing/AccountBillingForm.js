import React from 'react';
import PropTypes from 'prop-types';
import { injectStripe } from 'react-stripe-elements';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';

import FormFieldCard from '../../../forms/FormFieldCard';
import FormField from '../../../forms/FormField';

const cardValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter the name on your card.')
    .max(40, 'Maximum length is 40 characters.'),
  card: Yup.bool().required('Please enter your card details.'),
});

function AccountBillingForm({
 stripe, onClose, addCard, updateCard, hasCard, 
}) {
  const handleSubmit = async (fields, { setSubmitting, setErrors, setFieldError }) => {
    try {
      const token = await stripe.createToken({ name: fields.name });
      if (token.error) {
        setFieldError('card', token.error.message);
      } else {
        if (hasCard) {
          await updateCard(token);
        } else {
          await addCard(token);
        }
        onClose();
      }
    } catch (e) {
      setErrors(e);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    name: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={cardValidationSchema}
      onSubmit={handleSubmit}
      validateOnBlur={false}
      render={({ submitForm, isSubmitting }) => (
        <FormikForm>
          <Form.Group>
            <Form.Label>Name On Card:</Form.Label>
            <FormField name="name" autoComplete="cc-name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Card Number:</Form.Label>
            <FormFieldCard name="card" />
          </Form.Group>

          <div className="actions-row text-center">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => submitForm()} variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </FormikForm>
      )}
    />
  );
}

AccountBillingForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired,
  }).isRequired,
  hasCard: PropTypes.bool.isRequired,
  addCard: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
};

export default injectStripe(AccountBillingForm);
