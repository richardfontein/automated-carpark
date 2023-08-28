import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AccountBillingCard from './AccountBillingCard';
import AccountBillingInvoice from './AccountBillingInvoice';
import { isCorporateUser } from '../../../../../actions/authActions';

function AccountBilling({ isCorporate }) {
  return (
    <>
      {isCorporate === false ? (
        <>
          <div className="heading">
            <h3>Active Card</h3>
          </div>
          <AccountBillingCard />
        </>
      ) : null}

      <div className={`heading${isCorporate === false ? ' divider' : ''}`}>
        <h3>Past Invoices</h3>
      </div>
      <AccountBillingInvoice />
    </>
  );
}

AccountBilling.defaultProps = {
  isCorporate: undefined,
};

AccountBilling.propTypes = {
  isCorporate: PropTypes.bool,
};

const mapStateToProps = state => ({
  isCorporate: isCorporateUser(state),
});

export default connect(
  mapStateToProps,
  null,
)(AccountBilling);
