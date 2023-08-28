import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';

export default function TenancyItem({ tenancy }) {
  const {
 id, vehicleType, nickname, plates, 
} = tenancy;

  return (
    <LinkContainer key={id} to={`/admin/tenancies/${id}`} style={{ cursor: 'pointer' }}>
      <tr>
        <th scope="row">{id}</th>
        <td>{vehicleType}</td>
        <td>{nickname}</td>
        <td>{plates.map(plate => plate.registration).join(', ')}</td>
      </tr>
    </LinkContainer>
  );
}

TenancyItem.propTypes = {
  tenancy: PropTypes.shape({
    id: PropTypes.number.isRequired,
    vehicleType: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    plates: PropTypes.arrayOf(
      PropTypes.shape({
        registration: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};
