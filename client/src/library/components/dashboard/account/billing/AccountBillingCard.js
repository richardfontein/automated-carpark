import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AccountBillingCardDisplay from './AccountBillingCardDisplay';
import AccountBillingCardModal from './AccountBillingCardModal';

function AccountBillingCard({ customerLoading }) {
  if (customerLoading) {
    return 'Loading...';
  }

  return (
    <>
      <AccountBillingCardDisplay />
      <div className="actions-row">
        <AccountBillingCardModal />
      </div>
    </>
  );
}

AccountBillingCard.propTypes = {
  customerLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  customerLoading: state.billing.customerLoading,
});

export default connect(
  mapStateToProps,
  null,
)(AccountBillingCard);
