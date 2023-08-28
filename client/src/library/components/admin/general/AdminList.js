import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import AdminItem from './AdminItem';
import { getAdministrators } from '../../../../actions/adminActions';

function AdminList({ adminList, isLoading }) {
  const adminCount = adminList.length;

  let gridContent;
  if (isLoading) {
    // Admins are loading
    gridContent = (
      <div className="no-data">
        <h3>Loading...</h3>
      </div>
    );
  } else {
    // Set grid content based on admin count.
    gridContent = adminCount === 0 ? (
      <div className="no-data">
        <h3>No Admins</h3>
      </div>
      ) : (
        <div
          className="table-responsive"
          style={{
            maxHeight: '30rem',
            overflow: 'auto',
            display: 'block',
          }}
        >
          <table className="table table-striped table-hover table-sm mb-0">
            <thead className="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {adminList
                .sort((a, b) => a.id - b.id)
                .map(admin => (
                  <AdminItem key={admin.id} admin={admin} />
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
          <LinkContainer exact to="/admin/general/add">
            <Button variant="secondary">New Admin</Button>
          </LinkContainer>
        </Col>
      </Row>

      <div className="grid-container">{gridContent}</div>
    </>
  );
}

AdminList.propTypes = {
  adminList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  adminList: getAdministrators(state),
  isLoading: state.admin.usersLoading,
});

export default connect(
  mapStateToProps,
  null,
)(AdminList);
