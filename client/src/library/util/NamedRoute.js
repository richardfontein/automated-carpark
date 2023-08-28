import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function NamedRoute({
 component: Component, render, title, noAuth, isAuthenticated, ...rest 
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        /* Name the page */
        if (title) document.title = title;
        // Redirect authenticated users from certain routes with noAuth prop set (eg. login)
        if (noAuth && isAuthenticated) {
          return <Redirect to="/dashboard" />;
        }

        if (Component) {
          return <Component {...props} />;
        }
        return render(props);
      }}
    />
  );
}

NamedRoute.defaultProps = {
  component: null,
  render: null,
  title: null,
  noAuth: false,
};

NamedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.object]),
  render: PropTypes.func,
  title: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  noAuth: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  null,
)(NamedRoute);
