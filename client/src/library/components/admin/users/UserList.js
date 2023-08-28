import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
 Button, Row, Col, Form, 
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import FormattedSelectButtonList from '../../button/FormattedSelectButtonList';
import UserItem from './UserItem';
import { sortArray } from './util';
import { getUsers } from '../../../../actions/adminActions';

function UserList({ userList, isLoading }) {
  // Define sort keys
  const sortKeys = {
    ID: 'id',
    First: 'firstName',
    Last: 'lastName',
    Email: 'email',
    Company: 'company',
  };

  const userCount = userList.length;

  // Define sort parameters
  const defaultSortBy = 'id';
  const [sortBy, setSortBy] = useState(defaultSortBy);
  sortArray(userList, sortBy, defaultSortBy);

  const handleSelect = (key) => {
    const sortKey = sortKeys[key];
    setSortBy(sortKey);
    sortArray(userList, sortKey, defaultSortBy);
  };

  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filteredUserList = userList.filter(item =>
    Object.keys(item).some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return item[key].toLowerCase().includes(filter);
      }
      return false;
    }));

  let gridContent;
  if (isLoading) {
    // Users are loading
    gridContent = (
      <div className="no-data">
        <h3>Loading...</h3>
      </div>
    );
  } else {
    // Set grid content based on user count.
    gridContent = userCount === 0 ? (
      <div className="no-data">
        <h3>No Users</h3>
      </div>
      ) : (
        <div
          className="table-responsive"
          style={{
            maxHeight: '30rem',
            overflow: 'auto',
          }}
        >
          <table className="table table-striped table-hover table-sm mb-0">
            <thead className="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Company</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserList.map(user => (
                <UserItem key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      );
  }

  return (
    <>
      <Row className="button-list align-items-center">
        <Col lg="auto">
          <LinkContainer exact to="/admin/users/add">
            <Button variant="secondary">New User</Button>
          </LinkContainer>
        </Col>

        {userCount > 1 ? (
          <FormattedSelectButtonList
            keyList={Object.keys(sortKeys)}
            onSelect={handleSelect}
            description="Sort by:"
          />
        ) : null}

        <Col className="mt-3 mt-lg-0">
          <Form.Control placeholder="Search" onChange={handleFilterChange}></Form.Control>
        </Col>
      </Row>

      <div className="grid-container">{gridContent}</div>
    </>
  );
}

UserList.propTypes = {
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  userList: getUsers(state),
  isLoading: state.admin.usersLoading,
});

export default connect(
  mapStateToProps,
  null,
)(UserList);
