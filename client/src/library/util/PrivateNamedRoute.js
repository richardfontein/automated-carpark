import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

function PrivateNamedRoute({
  component: Component,
  render,
  title,
  isAuthenticated,
  isLoading,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        /* Name the page */
        if (title) document.title = title;

        /* Check if user has privileges to access page, load page if loading */
        if (isAuthenticated || isLoading) {
          if (Component) {
            return <Component {...props} />;
          }
          return render(props);
        }

        /* No auth token, redirect to login */
        return (
          <Redirect
            to={{
              pathname: '/dashboard/login',
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
}

PrivateNamedRoute.defaultProps = {
  component: null,
  render: null,
  title: null,
  location: null,
};

PrivateNamedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.object]),
  render: PropTypes.func,
  location: PropTypes.shape({ state: PropTypes.object }),
  title: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(
  mapStateToProps,
  null,
)(PrivateNamedRoute);
