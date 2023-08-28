import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

export default function Hero({ children, backgroundImage }) {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
      }}
    >
      <div className="hero-content">
        <Container>{children}</Container>
      </div>
    </div>
  );
}

Hero.defaultProps = {
  backgroundImage: null,
  children: null,
};

Hero.propTypes = {
  backgroundImage: PropTypes.string,
  children: PropTypes.node,
};
