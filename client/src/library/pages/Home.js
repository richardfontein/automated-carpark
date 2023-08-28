import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import Navigation from '../components/layout/header/Navigation';
import Hero from '../components/layout/body/Hero';
import Footer from '../components/layout/footer/Footer';

import banner from '../../res/images/home-page-hero-2000.jpeg';

function Home({ isAuthenticated }) {
  const Buttons = () =>
  (isAuthenticated ? (
    <LinkContainer to="/dashboard">
      <Button variant="hero">View Dashboard</Button>
    </LinkContainer>
  ) : (
    <>
      <LinkContainer to="/dashboard/signup">
        <Button variant="hero">Sign Up</Button>
      </LinkContainer>
      <p style={{ fontSize: '0.75rem', margin: '1rem 0rem' }}>— OR —</p>
      <LinkContainer to="/dashboard/login">
        <Button variant="outline-hero-light">Log In</Button>
      </LinkContainer>
    </>
  ));

  return (
    <>
      <Navigation />
      <Hero backgroundImage={banner}>
        <div className="hero-text">
          <div className="heading-jumbo">Welcome</div>
          <h4>to Automated Carpark</h4>
        </div>
        <Buttons />
      </Hero>
      <Footer />
    </>
  );
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(Home);
