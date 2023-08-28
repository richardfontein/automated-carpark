import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';

export default function AdminItem({ admin }) {
  const {
 id, firstName, lastName, email, 
} = admin;

  return (
    <LinkContainer to={`/admin/general/${id}`} style={{ cursor: 'pointer' }}>
      <tr>
        <th scope="row">{id}</th>
        <td>{firstName}</td>
        <td>{lastName}</td>
        <td>{email}</td>
      </tr>
    </LinkContainer>
  );
}

AdminItem.defaultProps = {
  admin: {
    xeroContactId: '',
  },
};

AdminItem.propTypes = {
  admin: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};
