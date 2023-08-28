import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import { Button } from 'react-bootstrap';

import { tenancySchema } from './tenancySchema';
import TenancyForm from './TenancyForm';
import { getActiveTenancy, updateTenancy } from '../../../../actions/tenancyActions';

function TenancyEdit(props) {
  const {
    getActiveTenancy: loadTenancy,
    match: {
      params: { id },
    },
  } = props;

  let initialValues = loadTenancy(parseInt(id, 10));

  // Renders fallback UI if tenancy does not exist for the user
  if (initialValues === null) {
    return (
      <>
        <div className="button-list">
          <LinkContainer exact to="/dashboard/tenancies/general">
            <Button variant="secondary">
              <FontAwesomeIcon icon="chevron-left" className="mr-2" />
              Back
            </Button>
          </LinkContainer>
        </div>
        <div>Tenancy does not exist.</div>
      </>
    );
  }

  initialValues = initialValues
    || (initialValues = {
      vehicleType: 'Car',
      plates: [{ registration: '' }],
      nickname: '',
      startDate: null,
      endDate: null,
    });

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      await props.updateTenancy(fields);
      props.history.push('/dashboard/tenancies/general');
    } catch (err) {
      if (err.card) {
        setErrors(err);
      } else {
        setErrors({ card: 'Your payment could not be processed. Please try again later.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="button-list">
        <LinkContainer exact to="/dashboard/tenancies/general">
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container">
        <div className="form-wrapper">
          <div className="heading">
            <h4>Update your tenancy details below</h4>
          </div>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={(values) => {
              try {
                validateYupSchema(values, tenancySchema, true, initialValues);
              } catch (err) {
                return yupToFormErrors(err);
              }

              return {};
            }}
            onSubmit={handleSubmit}
            render={formProps => <TenancyForm {...formProps} />}
          />
        </div>
      </div>
    </>
  );
}

TenancyEdit.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  updateTenancy: PropTypes.func.isRequired,
  getActiveTenancy: PropTypes.func.isRequired,
  match: PropTypes.shape(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

const mapStateToProps = state => ({
  getActiveTenancy: getActiveTenancy(state),
});

const mapDispatchToProps = {
  updateTenancy,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TenancyEdit);
