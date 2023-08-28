import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';

export default function UserItem({ user }) {
  const {
 id, firstName, lastName, email, company, 
} = user;

  return (
    <LinkContainer to={`/admin/users/${id}`} style={{ cursor: 'pointer' }}>
      <tr>
        <th scope="row">{id}</th>
        <td>{firstName}</td>
        <td>{lastName}</td>
        <td>{email}</td>
        <td>{company}</td>
      </tr>
    </LinkContainer>
  );
}

UserItem.defaultProps = {
  user: {
    xeroContactId: '',
  },
};

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    corporateCarparks: PropTypes.number.isRequired,
    xeroContactId: PropTypes.string,
  }),
};
