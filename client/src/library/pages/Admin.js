import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Hero from '../components/layout/body/Hero';
import PageHeader from '../components/layout/header/PageHeader';
import MainContent from '../components/layout/body/MainContent';
import { Nav, Tab } from '../components/nav/Nav';
import { AdminRoute } from '../util/RouterUtil';

import UserGeneral from '../components/admin/users/UserGeneral';
import TenancyGeneral from '../components/admin/tenancies/TenancyGeneral';
import AdminGeneral from '../components/admin/general/AdminGeneral';
import LoginFormWrapper from '../components/admin/login/LoginFormWrapper';

import {
  adminGetUsers,
  getUserCount,
  getTenancyCount,
  getAdministratorCount,
  adminGetXeroContacts,
  adminGetAllTenancies,
  adminLogout,
  adminLoad,
} from '../../actions/adminActions';

function Admin(props) {
  const {
    userCount,
    tenancyCount,
    administratorCount,
    isAuthenticated,
    logout,
    isLoading,
  } = props;
  useEffect(() => {
    props.loadAdmin();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      props.loadUsers();
      props.loadTenancies();
      props.loadXeroContacts();
    }

    // eslint-disable-next-line
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <Hero>
        <div>Loading...</div>
      </Hero>
    );
  }

  return isAuthenticated ? (
    <>
      <PageHeader title="Carpark Administration">
        <Button onClick={() => logout()}>Logout</Button>
      </PageHeader>

      <MainContent>
        <Nav className="above-grid">
          <Tab to="/admin/users">
            <strong>{userCount}</strong>
            {userCount === 1 ? ' User' : ' Users'}
          </Tab>
          <Tab to="/admin/tenancies">
            <strong>{tenancyCount}</strong>
            {tenancyCount === 1 ? ' Tenancy' : ' Tenancies'}
          </Tab>
          <Tab to="/admin/general">
            <strong>{administratorCount}</strong>
            {administratorCount === 1 ? ' Admin' : ' Admins'}
          </Tab>
        </Nav>
        <Switch>
          <AdminRoute path="/admin/users" component={UserGeneral} />
          <AdminRoute path="/admin/tenancies" component={TenancyGeneral} />
          <AdminRoute path="/admin/general" component={AdminGeneral} />

          <Redirect to="/admin/users" />
        </Switch>
      </MainContent>
    </>
  ) : (
    <Hero>
      <LoginFormWrapper {...props} />
    </Hero>
  );
}

Admin.propTypes = {
  loadUsers: PropTypes.func.isRequired,
  loadXeroContacts: PropTypes.func.isRequired,
  loadTenancies: PropTypes.func.isRequired,
  userCount: PropTypes.number.isRequired,
  tenancyCount: PropTypes.number.isRequired,
  administratorCount: PropTypes.number.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  loadAdmin: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  userCount: getUserCount(state),
  tenancyCount: getTenancyCount(state),
  administratorCount: getAdministratorCount(state),
  isAuthenticated: state.admin.isAuthenticated,
  isLoading: state.admin.isLoading,
});

const mapDispatchToProps = {
  loadUsers: adminGetUsers,
  loadXeroContacts: adminGetXeroContacts,
  loadTenancies: adminGetAllTenancies,
  logout: adminLogout,
  loadAdmin: adminLoad,
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
