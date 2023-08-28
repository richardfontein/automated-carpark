import React from 'react';
import PropTypes from 'prop-types';

import { Col, Button as BootstrapButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = ({ children }) => <div className="header">{children}</div>;
Header.propTypes = {
  children: PropTypes.node.isRequired,
};

const Title = ({ children }) => <h3>{children}</h3>;
Title.propTypes = {
  children: PropTypes.node.isRequired,
};

const Cost = ({ children, cost, unit }) => (
  <div className="cost">
    <span className="amount">{`$${cost.toFixed(2)}`}</span>
    <span className="unit">{unit ? `/${unit}` : ''}</span>
    <div className="all-caps-small">{children}</div>
  </div>
);
Cost.propTypes = {
  children: PropTypes.node.isRequired,
  cost: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
};

const Description = ({ children }) => <div className="description">{children}</div>;
Description.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Feature = ({ children }) => <ul className="features">{children}</ul>;
Feature.propTypes = {
  children: PropTypes.node.isRequired,
};

const FeatureItem = ({ children, not }) => <li className={not ? 'not' : ''}>{children}</li>;
Feature.Item = FeatureItem;
FeatureItem.defaultProps = {
  not: false,
};
FeatureItem.propTypes = {
  children: PropTypes.node.isRequired,
  not: PropTypes.bool,
};

const Button = ({ children, to }) => (
  <LinkContainer to={to}>
    <BootstrapButton block>{children}</BootstrapButton>
  </LinkContainer>
);
Button.defaultProps = {
  to: '/',
};
Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
};

export const Plan = ({ children, show }) => (
  <Col className="plan-wrapper" style={{ display: show ? 'block' : 'none' }} xs="12" xl>
    <div className="plan">{children}</div>
  </Col>
);
Plan.defaultProps = {
  show: true,
};
Plan.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
};

Plan.Header = Header;
Plan.Title = Title;
Plan.Cost = Cost;
Plan.Description = Description;
Plan.Feature = Feature;
Plan.Button = Button;

Plan.displayName = 'Plan';
export default Plan;
