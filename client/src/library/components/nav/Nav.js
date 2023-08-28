import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export const Nav = ({ children, className, ...rest }) => (
  <div {...rest} className={`nav nav-tabs ${className}`}>
    {children}
  </div>
);

Nav.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const Tab = ({ children, ...rest }) => (
  <NavLink {...rest} className="nav-link">
    {children}
  </NavLink>
);

Tab.propTypes = {
  children: PropTypes.node.isRequired,
};
