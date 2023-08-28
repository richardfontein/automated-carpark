import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form as FormikForm, FieldArray } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';

import FormField from '../../forms/FormField';
import FormFieldSelect from '../../forms/FormFieldSelect';
import FormDatepicker from '../../forms/FormDatepicker';
import TenancyConfirmModal from './TenancyConfirmModal';
import { getMinimumEndDate } from './util';
import { convertTzDate, AUCKLAND_IANTZ_CODE } from '../../../util/date';
import { isCorporateUser } from '../../../../actions/authActions';

function TenancyForm({
 initialValues, values, isSubmitting, setFieldValue, isCorporate, 
}) {
  /* Helper function to process initial values to get tenancy facts,
     used for conditional rendering.
   */
  const { subscriptionStarted, subscriptionEnded } = initialValues;
  const inProgress = subscriptionStarted && !subscriptionEnded;
  const today = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE);

  /* Custom handling of Vehicle change event to delete values from registration
     fields when vehicleType is Bicycle
  */
  const handleVehicleChange = (value) => {
    if (value === 'Bicycle') {
      setFieldValue('plates', []);
    } else {
      setFieldValue('plates', initialValues.plates);
    }
  };

  /* Conditionally render Action buttons based on Tenancy state */
  const submitButtonText = initialValues ? 'Save Tenancy' : 'Add Tenancy';
  const SubmitButton = (
    <Col>
      {inProgress || isCorporate === true ? (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Loading...' : submitButtonText}
        </Button>
      ) : (
        <TenancyConfirmModal buttonText={submitButtonText} />
      )}
    </Col>
  );

  return (
    <FormikForm>
      <Form.Group>
        <FormFieldSelect
          name="vehicleType"
          options={['Car', 'Motorbike', 'Bicycle']}
          disabled={inProgress}
          onChange={handleVehicleChange}
        />
      </Form.Group>

      <FieldArray
        name="plates"
        render={arrayHelpers =>
          (values.plates
            ? values.plates.map((plate, index) => (
                // eslint-disable-next-line react/no-array-index-key
              <Form.Group key={index}>
                <FormField
                  name={`plates[${index}].registration`}
                  placeholder={`Plate ${index + 1}`}
                />
                {index === values.plates.length - 1 && values.plates.length < 2 ? (
                  <button
                    tabIndex="-1"
                    type="button"
                    className="btn-field-array"
                    onClick={() => arrayHelpers.push({ registration: '' })}
                  >
                      Add a secondary plate
                  </button>
                  ) : null}
                {index !== 0 ? (
                  <button
                    tabIndex="-1"
                    type="button"
                    className="btn-field-array"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                      Remove plate
                  </button>
                  ) : null}
              </Form.Group>
              ))
            : null)
        }
      />

      <Form.Group>
        <FormField name="nickname" placeholder="Nickname (optional)" />
      </Form.Group>

      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>{subscriptionStarted ? 'Started:' : 'Starting:'}</Form.Label>
          <FormDatepicker
            name="startDate"
            placeholder="Start Date"
            popperPlacement="top-start"
            minDate={today}
            disabled={inProgress}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>{subscriptionEnded ? 'Ended:' : 'Ending:'}</Form.Label>
          <FormDatepicker
            name="endDate"
            placeholder="(optional)"
            popperPlacement="top-end"
            minDate={getMinimumEndDate()}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>{SubmitButton}</Form.Row>
    </FormikForm>
  );
}

const tenancyDefaultPropTypes = {
  id: null,
  endDate: '',
  nickname: null,
};

TenancyForm.defaultProps = {
  initialValues: tenancyDefaultPropTypes,
  values: tenancyDefaultPropTypes,
};

const tenancyPropTypes = PropTypes.shape({
  id: PropTypes.number,
  vehicleType: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date),
  nickname: PropTypes.string,
  plates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      registration: PropTypes.string.isRequired,
    }),
  ).isRequired,
});

TenancyForm.defaultProps = {
  isCorporate: undefined,
};

TenancyForm.propTypes = {
  initialValues: tenancyPropTypes,
  values: tenancyPropTypes,
  setFieldValue: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isCorporate: PropTypes.bool,
};

const mapStateToProps = state => ({
  isCorporate: isCorporateUser(state),
});

export default connect(
  mapStateToProps,
  null,
)(TenancyForm);
