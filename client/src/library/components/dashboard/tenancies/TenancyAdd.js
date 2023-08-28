import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik } from 'formik';
import { Button } from 'react-bootstrap';

import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../../../util/date';
import { addTenancy } from '../../../../actions/tenancyActions';
import { tenancySchema } from './tenancySchema';
import TenancyForm from './TenancyForm';

function TenancyAdd(props) {
  const initialValues = {
    vehicleType: 'Car',
    plates: [{ registration: '' }],
    nickname: '',
    startDate: convertTzDate(new Date(), AUCKLAND_IANTZ_CODE),
    endDate: null,
  };

  const handleSubmit = async (fields, { setErrors, setSubmitting }) => {
    try {
      await props.addTenancy(fields);
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
            <h4>Enter your tenancy details below</h4>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={tenancySchema}
            onSubmit={handleSubmit}
            render={formProps => <TenancyForm {...formProps} />}
          />
        </div>
      </div>
    </>
  );
}

TenancyAdd.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  addTenancy: PropTypes.func.isRequired,
};

const mapDispatchToProps = { addTenancy };

export default connect(
  null,
  mapDispatchToProps,
)(TenancyAdd);
