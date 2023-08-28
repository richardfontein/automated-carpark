import React from 'react';
import PropTypes from 'prop-types';
import { Toast, Alert } from 'react-bootstrap';

export default function Notification({
 show, onClose, variant, delay, children, 
}) {
  return (
    <>
      <div className="notification-container" style={{ display: show ? 'block' : 'none' }}>
        <Toast
          show={show}
          onClose={onClose}
          delay={delay || 3000}
          autohide
          className="notification"
        >
          <Alert variant={`notification-${variant}`} show>
            {children}
          </Alert>
        </Toast>
      </div>
    </>
  );
}

Notification.defaultProps = {
  delay: 3000,
  variant: 'primary',
  children: null,
};

Notification.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  delay: PropTypes.number,
  variant: PropTypes.string,
  children: PropTypes.node,
};
