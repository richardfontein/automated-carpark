import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import { Button } from 'react-bootstrap';

import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../../../util/date';
import { tenancySchema } from './tenancySchema';
import TenancyForm from './TenancyForm';
import {
  getExpiredTenancy,
  updateTenancy,
  deleteTenancy,
} from '../../../../actions/tenancyActions';

function TenancyRenew(props) {
  const {
    getExpiredTenancy: loadTenancy,
    match: {
      params: { id },
    },
  } = props;

  let tenancy = loadTenancy(parseInt(id, 10));

  // Renders fallback UI if tenancy does not exist for the user
  if (tenancy === null) {
    return (
      <>
        <div className="button-list">
          <LinkContainer exact to="/dashboard/tenancies/expired">
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

  tenancy = tenancy
    || (tenancy = {
      vehicleType: 'Car',
      plates: [{ registration: '' }],
      nickname: '',
      startDate: null,
      endDate: null,
    });

  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);
  const initialValues = { ...tenancy, startDate: today, endDate: null };

  const handleSubmit = async (fields, { setSubmitting, setErrors }) => {
    try {
      await props.updateTenancy(fields);
      props.history.push('/dashboard/tenancies/expired');
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
        <LinkContainer exact to="/dashboard/tenancies/expired">
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

TenancyRenew.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  updateTenancy: PropTypes.func.isRequired,
  getExpiredTenancy: PropTypes.func.isRequired,
  match: PropTypes.shape(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

const mapStateToProps = state => ({
  getExpiredTenancy: getExpiredTenancy(state),
});

const mapDispatchToProps = {
  updateTenancy,
  deleteTenancy,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TenancyRenew);
