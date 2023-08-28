import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect as connectRedux } from 'react-redux';
import {
 Button, Modal, Col, Row, Alert, 
} from 'react-bootstrap';
import { connect as connectFormik } from 'formik';
import { format as formatDate, differenceInDays, differenceInMonths } from 'date-fns';

import { convertTzDate, AUCKLAND_IANTZ_CODE, addMonths } from '../../../util/date';
import AccountBillingCardModal from '../account/billing/AccountBillingCardModal';
import {
  getActiveCard,
  hasActiveCard,
  getBillingCycleAnchor,
} from '../../../../actions/billingActions';

const priceList = { Car: 22425, Motorbike: 10000, Bicycle: 5000 };

const getProration = (
  amount,
  billingCycleAnchor = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE),
  prorationDate = convertTzDate(new Date(), AUCKLAND_IANTZ_CODE),
) => {
  const nextBillingDate = addMonths(
    billingCycleAnchor,
    // add 1 month to get next billing date
    differenceInMonths(prorationDate, billingCycleAnchor) + 1,
  );
  const daysRemainingThisBillingCycle = differenceInDays(nextBillingDate, prorationDate);
  const daysThisBillingCycle = differenceInDays(addMonths(prorationDate, 1), prorationDate);

  let proratedAmount;
  if (
    daysRemainingThisBillingCycle === 0
    || daysRemainingThisBillingCycle >= daysThisBillingCycle
  ) {
    proratedAmount = amount;
  } else {
    proratedAmount = Math.floor((daysRemainingThisBillingCycle / daysThisBillingCycle) * amount);
  }

  return { proratedAmount, daysRemainingThisBillingCycle, daysThisBillingCycle };
};

function TenancyConfirmModal({
  formik: {
 validateForm, setTouched, values, submitForm, isSubmitting, errors: formikErrors, 
},
  buttonText,
  card,
  hasCard,
  billingCycleAnchor,
}) {
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length !== 0) {
        /* Set fields with errors to touched */
        setTouched(errors);
      } else {
        /* No errors */
        setShow(true);
      }
    });
  };
  const handleClose = () => setShow(false);

  const { startDate, vehicleType } = values;
  const startDateFormatted = formatDate(startDate, 'dd/MM/yyyy');
  const startsToday = startDate
    ? startDate.getTime() === convertTzDate(new Date(), AUCKLAND_IANTZ_CODE).getTime()
    : false;
  const startingDescription = startsToday ? "Today's total:" : `Total on ${startDateFormatted}`;
  const totalPrice = priceList[vehicleType];

  // Calculates billing cycle anchor if none is given
  let calculatedBillingCycleAnchor = billingCycleAnchor;
  if (billingCycleAnchor) {
    // When billingCycleAnchor is further than the start date
    if (billingCycleAnchor > values.startDate) {
      // Calculated billingCycleAnchor is the given start date
      calculatedBillingCycleAnchor = values.startDate;
    } else {
      // Calculated billingCycleAnchor is the billingCycleAnchor
      calculatedBillingCycleAnchor = billingCycleAnchor;
    }
  } else {
    // When no billingCycleAnchor is given, anchor is startDate
    calculatedBillingCycleAnchor = values.startDate;
  }
  const { proratedAmount, daysRemainingThisBillingCycle, daysThisBillingCycle } = getProration(
    totalPrice,
    calculatedBillingCycleAnchor,
    startDate,
  );
  const priceFormatted = `${(proratedAmount / 100).toFixed(2)} ${
    daysRemainingThisBillingCycle === daysThisBillingCycle ? '' : '*'
  }`;

  const CardDetail = () => {
    /* Do not render card details if no card is added */
    if (!hasCard) {
      return null;
    }
    return (
      <Col className="card-detail" xs={12} sm>
        <div className="card-description">Card on file:</div>
        <div className="card-value">{`${card.brand} ${card.last4}`}</div>
      </Col>
    );
  };

  const NextBillingDate = () => {
    /* Don't render next billing date if billing does not start today */
    if (!startsToday || !hasCard) {
      return null;
    }
    const nextBillingDate = formatDate(addMonths(billingCycleAnchor || startDate, 1), 'dd/MM/yyyy');
    return (
      <Col className="card-detail" xs={12} sm="auto">
        <div className="card-description">Next billing date:</div>
        <div className="card-value">{nextBillingDate}</div>
      </Col>
    );
  };

  const ProrationText = () => {
    if (daysRemainingThisBillingCycle === daysThisBillingCycle) {
      return null;
    }
    return `* Parking for ${daysRemainingThisBillingCycle} out of ${daysThisBillingCycle} days this billing cycle at $${(
      totalPrice / 100
    ).toFixed(2)} per month`;
  };

  const submitButtonText = `${startsToday ? 'Start' : 'Save'} Tenancy`;
  const submitButtonSubmittingText = startsToday ? 'Processing Payment...' : 'Saving...';
  const SubmitButton = () =>
    (hasCard ? (
      <Button onClick={submitForm} disabled={isSubmitting}>
        {isSubmitting ? submitButtonSubmittingText : submitButtonText}
      </Button>
    ) : (
      <AccountBillingCardModal />
    ));

  return (
    <>
      <Button onClick={handleOpen}>{buttonText}</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Tenancy</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card-confirm">
          <div className="all-caps-small">Payment Details</div>
          <Row noGutters className="cards">
            <Col className="card-detail" xs={12} sm>
              <div className="card-description">{startingDescription}</div>
              <div className="card-value">{`$${priceFormatted}`}</div>
            </Col>
            <CardDetail />
            <NextBillingDate />
          </Row>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: ProrationText() ? 'block' : 'none',
            fontSize: '0.75rem',
          }}
        >
          <ProrationText />
        </Modal.Footer>
        <Modal.Footer
          style={{
            paddingBottom: 0,
            display: Object.keys(formikErrors).length !== 0 ? 'block' : 'none',
          }}
        >
          <Alert variant="danger">{formikErrors.card}</Alert>
        </Modal.Footer>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <SubmitButton />
        </Modal.Footer>
      </Modal>
    </>
  );
}

TenancyConfirmModal.defaultProps = {
  billingCycleAnchor: null,
  card: null,
};

TenancyConfirmModal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    validateForm: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    values: PropTypes.shape({
      startDate: PropTypes.instanceOf(Date),
      vehicleType: PropTypes.string.isRequired,
    }).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    last4: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    exp_year: PropTypes.number.isRequired,
    exp_month: PropTypes.number.isRequired,
  }),
  hasCard: PropTypes.bool.isRequired,
  billingCycleAnchor: PropTypes.instanceOf(Date),
};

const mapStateToProps = state => ({
  card: getActiveCard(state),
  hasCard: hasActiveCard(state),
  billingCycleAnchor: getBillingCycleAnchor(state),
});

export default connectRedux(mapStateToProps, null)(connectFormik(TenancyConfirmModal));
