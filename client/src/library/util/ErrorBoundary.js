import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Navigation from '../components/layout/header/Navigation';
import MainContent from '../components/layout/body/MainContent';
import Footer from '../components/layout/footer/Footer';

const { NODE_ENV } = process.env;

const logError = (...error) => {
  const message = error.join(' ');
  const data = { message };
  axios.post('/api/logger', data).catch(() => {
    // Error could not be processed on server
  });
};
export default class ErrorBoundary extends React.Component {
  style = {
    button: { marginTop: '1rem' },
    error: { textAlign: 'center', marginTop: '1rem' },
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // log the error to our server with loglevel
    if (NODE_ENV === 'development') {
      logError(error.message, info.componentStack);
    } else {
      logError(error.stack, '\n');
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <Navigation />
          <MainContent>
            <div style={this.style.error}>
              <h1>Oops, something went wrong.</h1>
              <a href="/" className="btn btn-primary" style={this.style.button}>
                Back to home page
              </a>
            </div>
          </MainContent>
          <Footer />
        </>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
};
