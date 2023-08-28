import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

export default function PageHeader({ title, children }) {
  return (
    <header className="page-header">
      <Container>
        <h3>{title}</h3>
        {children}
      </Container>
    </header>
  );
}

PageHeader.defaultProps = { children: null };

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
