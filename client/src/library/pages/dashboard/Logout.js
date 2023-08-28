import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logout } from '../../../actions/authActions';

function Logout(props) {
  const { logout: logoutUser } = props;
  logoutUser();

  return <Redirect to="/" />;
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  logout,
};

export default connect(null, mapDispatchToProps)(Logout);
