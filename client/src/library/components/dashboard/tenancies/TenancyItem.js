import React from 'react';
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TenancyDeleteModal from './TenancyDeleteModal';

export default function TenancyItem({ tenancy, deleteItem, isCorporate }) {
  const {
 id, vehicleType, plates, nickname, startDate, endDate, 
} = tenancy;

  const { subscriptionStarted, subscriptionEnded } = tenancy;
  const inProgress = subscriptionStarted && !subscriptionEnded;

  const formattedStartDate = (subscriptionStarted ? 'Started: ' : 'Starting: ') + formatDate(startDate, 'dd/MM/yyyy');
  const formattedEndDate = endDate === null
      ? ''
      : (subscriptionEnded ? 'Ended: ' : 'Ending: ') + formatDate(endDate, 'dd/MM/yyyy');

  const actionButtonText = subscriptionEnded ? 'Renew Tenancy' : 'Edit Tenancy';
  const actionButtonPath = subscriptionEnded ? 'expired/renew' : 'general/edit';

  // Delete button enabled if tenancy has not started or if tenancy has ended
  const DeleteButton = () =>
    (isCorporate || !inProgress ? (
      <TenancyDeleteModal
        onDelete={() => deleteItem(id)}
        bodyText="Are you sure you want to delete your tenancy?"
      />
    ) : null);

  return (
    <Row className="grid-item" noGutters>
      <Col className="col-6 col-md-8">
        <Row>
          <Col className="col-md-3">
            <Row>
              <Col>{vehicleType}</Col>
            </Row>
            <Row>
              <Col className="all-caps-small">{nickname}</Col>
            </Row>
          </Col>
          <Col className="col-md-5 d-none d-md-block" sm="auto">
            <Row>
              <em>{formattedStartDate}</em>
            </Row>
            <Row>
              <em>{formattedEndDate}</em>
            </Row>
          </Col>
          <Col className="col-12 col-md-4">
            {plates.map(plate => (
              <Row key={plate.id} noGutters>
                <strong>{plate.registration}</strong>
              </Row>
            ))}
          </Col>
        </Row>
      </Col>
      <Col className="grid-button col-6 col-md-4">
        <DeleteButton />
        <LinkContainer to={`/dashboard/tenancies/${actionButtonPath}/${id}`}>
          <Button className="ml-2" variant="secondary">
            <FontAwesomeIcon icon="edit" className="d-sm-none" />
            <span className="d-none d-sm-block">{actionButtonText}</span>
          </Button>
        </LinkContainer>
      </Col>
    </Row>
  );
}

TenancyItem.defaultProps = {
  tenancy: {
    endDate: null,
    nickname: null,
  },
};

TenancyItem.propTypes = {
  tenancy: PropTypes.shape({
    id: PropTypes.number.isRequired,
    vehicleType: PropTypes.string.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date),
    nickname: PropTypes.string,
    plates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        registration: PropTypes.string.isRequired,
      }),
    ).isRequired,
    subscriptionStarted: PropTypes.bool.isRequired,
    subscriptionEnded: PropTypes.bool.isRequired,
  }),
  deleteItem: PropTypes.func.isRequired,
  isCorporate: PropTypes.bool.isRequired,
};
