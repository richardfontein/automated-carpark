import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <footer className="page-footer">
      <Container>
        <div className="footer-content">
          <Row>
            <Col xs={12} md={4}>
              <div className="footer-links">
                <Link to="/terms">Terms</Link>
                <Link to="/support/contact">Contact</Link>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="copyright">
                <p>{`Automated Carpark © ${getCurrentYear()}`}</p>
              </div>
            </Col>
            <Col xs={12} md={4} />
          </Row>
        </div>
      </Container>
    </footer>
  );
}
