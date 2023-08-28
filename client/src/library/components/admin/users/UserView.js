import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Col, Row } from 'react-bootstrap';

function UserView({
 user, customer, customerLoading, tenancies, tenanciesLoading, 
}) {
  const getOutstandingBalance = () => {
    let outstanding = 0;

    if (user.xeroContactId) {
      outstanding = customer.Balances ? customer.Balances.AccountsReceivable.Outstanding : 0;
    } else {
      outstanding = customer.balance ? customer.balance / 100 : 0;
    }

    return outstanding;
  };

  const getCarparksAllocated = () => {
    let carparksAllocated = 0;

    if (user.corporateCarparks === 0) {
      carparksAllocated = tenancies.length;
    } else {
      carparksAllocated = user.corporateCarparks;
    }

    return carparksAllocated;
  };

  const getCarparksOccupied = () => tenancies.length;

  const carparksAllocated = getCarparksAllocated();
  const carparksOccupied = getCarparksOccupied();
  const outstandingBalance = getOutstandingBalance();

  const CustomerLink = () => {
    if (!user.xeroContactId && !user.stripeCustomerId) {
      return null;
    }

    if (user.xeroContactId) {
      return (
        <Row>
          <Col>
            <strong>Xero Link</strong>
          </Col>
          <Col>
            <a
              href={`https://go.xero.com/Contacts/View/${user.xeroContactId}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              View Contact
            </a>
          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col>
          <strong>Stripe Link</strong>
        </Col>
        <Col>
          <a
            href={`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            View Customer
          </a>
        </Col>
      </Row>
    );
  };

  const BillingDetailsStripe = () => {
    if (!user.stripeCustomerId || !customer.sources || user.xeroContactId) {
      return null;
    }

    return (
      <Row>
        <Col>
          <strong>Saved Card</strong>
        </Col>
        <Col>{`XXXX-XXXX-XXXX-${customer.sources.data[0].last4}`}</Col>
      </Row>
    );
  };

  const BillingDetails = () => {
    if (!user.xeroContactId && !user.stripeCustomerId) {
      return (
        <Row>
          <Col>No Stripe customer or Xero contact linked.</Col>
        </Row>
      );
    }

    return (
      <>
        <CustomerLink />
        <BillingDetailsStripe />
        <Row>
          <Col>
            <strong>Outstanding Balance</strong>
          </Col>
          <Col>{customerLoading ? 'Loading...' : `$${outstandingBalance.toFixed(2)}`}</Col>
        </Row>
      </>
    );
  };

  const Tenancies = () => {
    if (tenanciesLoading) {
      return 'Tenancies loading...';
    }

    if (tenancies.length === 0) {
      return 'No tenancies added.';
    }

    return (
      <table
        className="table table-striped table-hover table-responsive-sm table-sm"
        style={{ marginBottom: 0 }}
      >
        <thead className="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Vehicle</th>
            <th scope="col">Nickname</th>
            <th scope="col">Plates</th>
          </tr>
        </thead>
        <tbody>
          {tenancies
            .sort((a, b) => a.id - b.id)
            .map(({
 id, vehicleType, nickname, plates, 
}) => (
  <LinkContainer
    key={id}
    to={`/admin/users/${user.id}/tenancies/${id}/edit`}
    style={{ cursor: 'pointer' }}
  >
    <tr>
      <th scope="row">{id}</th>
      <td>{vehicleType}</td>
      <td>{nickname}</td>
      <td>{plates.map(plate => plate.registration).join(', ')}</td>
    </tr>
  </LinkContainer>
            ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className="button-list">
        <LinkContainer exact to="/admin/users">
          <Button variant="secondary">
            <FontAwesomeIcon icon="chevron-left" className="mr-2" />
            Back
          </Button>
        </LinkContainer>
      </div>
      <div className="grid-container" style={{ padding: '1rem' }}>
        <Row>
          <Col md={{ span: 6, auto: true }}>
            <Row>
              <Col>
                <div className="heading">
                  <h4>User Details</h4>
                </div>
              </Col>
              <Col>
                <LinkContainer exact to={`/admin/users/${user.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </LinkContainer>
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>Name</strong>
              </Col>
              <Col>{user.firstName}</Col>
            </Row>
            <Row>
              <Col>
                <strong>Last Name</strong>
              </Col>
              <Col>{user.lastName}</Col>
            </Row>
            <Row>
              <Col>
                <strong>Email</strong>
              </Col>
              <Col>{user.email}</Col>
            </Row>
            <Row>
              <Col>
                <strong>Company</strong>
              </Col>
              <Col>{user.company}</Col>
            </Row>
            <Row>
              <Col>
                <strong>Carparks Allocated</strong>
              </Col>
              <Col>{`${carparksAllocated} carparks`}</Col>
            </Row>
            <Row>
              <Col>
                <strong>Carparks Occupied</strong>
              </Col>
              <Col>{`${carparksOccupied} carparks`}</Col>
            </Row>
          </Col>
          <Col md={{ span: 6, auto: true }} className="pt-4 pt-md-0">
            <Row>
              <Col>
                <div className="heading">
                  <h4>Billing Details</h4>
                </div>
              </Col>
              <Col>
                <LinkContainer exact to={`/admin/users/${user.id}/billing`}>
                  <Button variant="secondary">Link to Xero</Button>
                </LinkContainer>
              </Col>
            </Row>
            <BillingDetails />
          </Col>
        </Row>
        <Row>
          <Col className="pt-4">
            <Row>
              <Col>
                <div className="heading">
                  <h4>Tenancies</h4>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Tenancies />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

UserView.defaultProps = {
  user: {
    xeroContactId: '',
    stripeCustomerId: '',
  },
};

UserView.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    corporateCarparks: PropTypes.number.isRequired,
    xeroContactId: PropTypes.string,
    stripeCustomerId: PropTypes.string,
  }),
  tenancies: PropTypes.arrayOf(PropTypes.object).isRequired,
  tenanciesLoading: PropTypes.bool.isRequired,
  customer: PropTypes.oneOfType([
    PropTypes.shape({
      balance: PropTypes.number.isRequired,
      sources: PropTypes.shape({ data: PropTypes.array.isRequired }),
    }),
    PropTypes.shape({
      Balances: PropTypes.shape({
        AccountsReceivable: PropTypes.shape({ Outstanding: PropTypes.number.isRequired }),
      }),
    }),
  ]).isRequired,
  customerLoading: PropTypes.bool.isRequired,
};

export default UserView;
