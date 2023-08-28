import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';

import Signup from './dashboard/Signup';
import Login from './dashboard/Login';
import Tenancy from './dashboard/Tenancy';
import Account from './dashboard/Account';
import Forgot from './dashboard/Forgot';
import Reset from './dashboard/Reset';
import Logout from './dashboard/Logout';
import { NamedRoute, PrivateNamedRoute } from '../util/RouterUtil';
import { loadCustomer } from '../../actions/billingActions';

function Dashboard({ isAuthenticated, loadCustomer: getCustomer }) {
  useEffect(() => {
    if (isAuthenticated) {
      getCustomer();
    }
  }, [isAuthenticated, getCustomer]);

  return (
    <Switch>
      <NamedRoute
        exact
        path="/dashboard/signup"
        component={Signup}
        title="Sign Up - Automated Carpark"
        noAuth
      />
      <NamedRoute
        exact
        path="/dashboard/login"
        component={Login}
        title="Login - Automated Carpark"
        noAuth
      />
      <NamedRoute
        exact
        path="/dashboard/forgot"
        component={Forgot}
        title="Forgot Password - Automated Carpark"
        noAuth
      />
      <NamedRoute
        exact
        path="/dashboard/reset/:resetPasswordToken"
        component={Reset}
        title="Reset Password - Automated Carpark"
        noAuth
      />

      <PrivateNamedRoute path="/dashboard/tenancies" component={Tenancy} />
      <PrivateNamedRoute path="/dashboard/account" component={Account} />
      <PrivateNamedRoute exact path="/dashboard/logout" component={Logout} />

      <Redirect to="/dashboard/tenancies" />
    </Switch>
  );
}

Dashboard.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loadCustomer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {
  loadCustomer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
