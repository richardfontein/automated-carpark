import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

export default function MainContent({ children }) {
  return (
    <main className="page-body">
      <Container>{children}</Container>
    </main>
  );
}

MainContent.defaultProps = {
  children: null,
};

MainContent.propTypes = {
  children: PropTypes.node,
};
