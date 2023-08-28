import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Elements, StripeProvider } from 'react-stripe-elements';

import AccountBillingForm from './AccountBillingForm';
import { addCard, updateCard, hasActiveCard } from '../../../../../actions/billingActions';

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

function AccountBillingCardModal(props) {
  const [showModal, setShowModal] = useState(false);

  const { hasCard } = props;

  const handleClose = () => {
    setShowModal(false);
  };
  const handleShow = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button onClick={handleShow}>{`${hasCard ? 'Update' : 'Add'} Card`}</Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <strong>{`${hasCard ? 'Update' : 'Add'} Card`}</strong>
        </Modal.Header>
        <Modal.Body>
          <StripeProvider apiKey={stripePublishableKey}>
            <Elements>
              <AccountBillingForm onClose={handleClose} {...props} />
            </Elements>
          </StripeProvider>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

AccountBillingCardModal.propTypes = {
  hasCard: PropTypes.bool.isRequired,
  addCard: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  hasCard: hasActiveCard(state),
});

const mapDispatchToProps = {
  addCard,
  updateCard,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountBillingCardModal);
