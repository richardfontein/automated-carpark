import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TenancyDeleteModal({ onDelete, bodyText }) {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="danger" onClick={handleOpen}>
        <FontAwesomeIcon icon="trash" />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>{bodyText}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            onClick={() => {
              onDelete();
              handleClose();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

TenancyDeleteModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  bodyText: PropTypes.string.isRequired,
};
