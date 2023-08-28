import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { AdminRoute } from '../../../util/RouterUtil';
import UserEdit from './UserEdit';
import UserBilling from './UserBilling';
import UserView from './UserView';
import TenancyEdit from './UserTenancyEdit';

import {
  getUser,
  adminUpdateUser,
  adminGetCustomer,
  adminGetUserTenancies,
} from '../../../../actions/adminActions';

function UserController(props) {
  const {
    loadUser,
    updateUser,
    customer,
    customerLoading,
    loadTenancies,
    tenanciesLoading,
    xeroContacts,
    match: {
      params: { id },
    },
  } = props;

  useEffect(() => {
    props.getCustomer(parseInt(id, 10));
    // eslint-disable-next-line
  }, [id]);

  const tenancies = loadTenancies(parseInt(id, 10));
  const user = loadUser(parseInt(id, 10));

  // Renders fallback UI if user does not exist
  if (user === null) {
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
        <div>User does not exist.</div>
      </>
    );
  }

  return (
    <Switch>
      <AdminRoute
        exact
        path="/admin/users/:id"
        render={_props => (
          <UserView
            {..._props}
            user={user}
            customer={customer}
            tenancies={tenancies}
            customerLoading={customerLoading}
            tenanciesLoading={tenanciesLoading}
          />
        )}
        title={`User Summary - ${user.firstName} ${user.lastName}`}
      />
      <AdminRoute
        exact
        path="/admin/users/:id/edit"
        render={_props => <UserEdit {..._props} user={user} updateUser={updateUser} />}
        title={`Edit User - ${user.firstName} ${user.lastName}`}
      />
      <AdminRoute
        exact
        path="/admin/users/:id/billing"
        render={_props => (
          <UserBilling
            {..._props}
            user={user}
            updateUser={updateUser}
            xeroContacts={xeroContacts}
          />
        )}
        title={`Link User - ${user.firstName} ${user.lastName}`}
      />
      <AdminRoute
        exact
        path="/admin/users/:id/tenancies/:tenancyId/edit"
        render={_props => <TenancyEdit {..._props} user={user} updateUser={updateUser} />}
        title={`Edit Tenancy - ${user.firstName} ${user.lastName}`}
      />

      <Redirect to={`/admin/users/${id}`} />
    </Switch>
  );
}

UserController.propTypes = {
  loadUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  loadTenancies: PropTypes.func.isRequired,
  match: PropTypes.shape(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  customer: PropTypes.shape({}).isRequired,
  customerLoading: PropTypes.bool.isRequired,
  xeroContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tenanciesLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loadUser: getUser(state),
  customer: state.admin.customer,
  xeroContacts: state.admin.xeroContacts,
  customerLoading: state.admin.customerLoading,
  tenanciesLoading: state.admin.tenanciesLoading,
  loadTenancies: adminGetUserTenancies(state),
});

const mapDispatchToProps = {
  updateUser: adminUpdateUser,
  getCustomer: adminGetCustomer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserController);
