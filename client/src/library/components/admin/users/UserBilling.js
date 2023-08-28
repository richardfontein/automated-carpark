import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import {
 Formik, Form as FormikForm, validateYupSchema, yupToFormErrors, 
} from 'formik';
import { Button, Form, Col } from 'react-bootstrap';

import FormField from '../../forms/FormField';
import { userSchema } from './userSchema';

function UserBilling(props) {
  const { user, xeroContacts } = props;

  const initialValues = user;

  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filteredXeroContacts = xeroContacts.filter(item =>
    Object.keys(item).some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return item[key].toLowerCase().includes(filter);
      }
      return false;
    }));

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      await props.updateUser(fields);
      props.history.push(`/admin/users/${user.id}`);
    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="button-list">
        <LinkContainer exact to={`/admin/users/${user.id}`}>
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container">
        <div className="form-wrapper">
          <div className="heading">
            <h4>Link Xero contact below</h4>
          </div>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={(values) => {
              try {
                validateYupSchema(values, userSchema, true, initialValues);
              } catch (err) {
                return yupToFormErrors(err);
              }

              return {};
            }}
            onSubmit={handleSubmit}
            render={({ isSubmitting, setFieldValue }) => (
              <FormikForm>
                <Form.Group>
                  <Form.Control
                    placeholder="Search (eg. name)"
                    onChange={handleFilterChange}
                  >
                  </Form.Control>
                </Form.Group>

                {filteredXeroContacts.length === 0 ? (
                  'No results.'
                ) : (
                  <div
                    className="table-responsive"
                    style={{
                      maxHeight: '20rem',
                      overflow: 'auto',
                      display: 'block',
                    }}
                  >
                    <table
                      className="table table-striped table-hover table-sm mb-0"
                      style={{ border: '1px solid #dbdbdb' }}
                    >
                      <tbody>
                        {filteredXeroContacts.sort().map(({ ContactID, Name }) => (
                          <tr key={ContactID}>
                            <td className="col">{Name}</td>
                            <td>
                              <Button
                                size="sm"
                                onClick={() => setFieldValue('xeroContactId', ContactID)}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <Form.Group className="pt-3">
                  <Form.Label>Xero Contact ID</Form.Label>
                  <FormField name="xeroContactId" />
                </Form.Group>

                <Form.Row>
                  <Col>
                    <Button disabled={isSubmitting} type="submit">
                      {isSubmitting ? 'Loading...' : 'Link Contact'}
                    </Button>
                  </Col>
                </Form.Row>
              </FormikForm>
            )}
          />
        </div>
      </div>
    </>
  );
}

UserBilling.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    corporateCarparks: PropTypes.number.isRequired,
  }).isRequired,
  xeroContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserBilling;
