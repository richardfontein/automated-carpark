import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import { Button } from 'react-bootstrap';

import { tenancySchema } from '../tenancies/tenancySchema';
import TenancyForm from '../tenancies/TenancyForm';
import { adminGetTenancy, adminUpdateTenancy } from '../../../../actions/adminActions';

function TenancyEdit(props) {
  const {
    getActiveTenancy: loadTenancy,
    match: {
      params: { tenancyId },
    },
    user,
  } = props;

  let initialValues = loadTenancy(parseInt(tenancyId, 10));

  // Renders fallback UI if tenancy does not exist for the user
  if (initialValues === null) {
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
      const values = tenancySchema.cast(fields);
      await props.updateTenancy(values);
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
            <h4>Update tenancy details below</h4>
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
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  getActiveTenancy: adminGetTenancy(state),
});

const mapDispatchToProps = {
  updateTenancy: adminUpdateTenancy,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TenancyEdit);
