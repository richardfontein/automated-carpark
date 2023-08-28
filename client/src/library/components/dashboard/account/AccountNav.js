import React from 'react';
import PropTypes from 'prop-types';
import { Nav, Tab } from '../../nav/Nav';

const AccountNav = ({ aboveGrid, aboveSettings }) => (
  <Nav className={(aboveGrid ? 'above-grid' : '') + (aboveSettings ? 'above-settings' : '')}>
    <Tab to="/dashboard/account/general">Profile</Tab>
    <Tab to="/dashboard/account/billing">Billing</Tab>
    <Tab to="/dashboard/account/password">Password</Tab>
  </Nav>
);

AccountNav.defaultProps = {
  aboveGrid: false,
  aboveSettings: false,
};

AccountNav.propTypes = {
  aboveGrid: PropTypes.bool,
  aboveSettings: PropTypes.bool,
};

export default AccountNav;
