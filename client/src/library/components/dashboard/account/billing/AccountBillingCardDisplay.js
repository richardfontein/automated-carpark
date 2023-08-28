import React from 'react';
import PropTypes from 'prop-types';
import { format as formatDate, endOfMonth } from 'date-fns';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import { getActiveCard } from '../../../../../actions/billingActions';

function AccountBillingCardDisplay({ card }) {
  // Subtract 1 from month because dates are 0-indexed
  let expiryDate;
  if (card) expiryDate = endOfMonth(new Date(card.exp_year, card.exp_month - 1));

  return card ? (
    <Row className="cards no-gutters">
      <Col className="card-detail" xs={12} sm={6}>
        <span>{`${card.name} – `}</span>
        <strong>{`${card.brand} `}</strong>
        <span>– XXXX-XXXX-XXXX </span>
        <strong>{card.last4}</strong>
      </Col>
      <Col className="card-detail" xs={12} sm={6}>
        <span>{new Date(expiryDate) > Date.now() ? 'Expires' : 'Expired'}</span>
        <div className="all-caps-small">{formatDate(expiryDate, 'MM/yy')}</div>
      </Col>
    </Row>
  ) : (
    <div className="no-data">No card added.</div>
  );
}

AccountBillingCardDisplay.defaultProps = {
  card: null,
};

AccountBillingCardDisplay.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    last4: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    exp_year: PropTypes.number.isRequired,
    exp_month: PropTypes.number.isRequired,
  }),
};

const mapStateToProps = state => ({
  card: getActiveCard(state),
  customerLoading: state.billing.customerLoading,
});

export default connect(
  mapStateToProps,
  null,
)(AccountBillingCardDisplay);
