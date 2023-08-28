import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';

import FormattedSelectButtonList from '../../button/FormattedSelectButtonList';
import TenancyItem from './TenancyItem';
import { sortArray } from './util';

function TenancyList({ tenancyList, tenanciesLoading }) {
  // Define sort keys
  const sortKeys = {
    ID: 'id',
    Vehicle: 'vehicleType',
    Nickname: 'nickname',
  };

  const tenancyCount = tenancyList.length;

  // Define sort parameters
  const defaultSortBy = 'id';
  const [sortBy, setSortBy] = useState(defaultSortBy);
  sortArray(tenancyList, sortBy, defaultSortBy);

  const handleSelect = (key) => {
    const sortKey = sortKeys[key];
    setSortBy(sortKey);
    sortArray(tenancyList, sortKey, defaultSortBy);
  };

  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filteredTenancyList = tenancyList.filter(item =>
    Object.keys(item).some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return item[key].toLowerCase().includes(filter);
      }
      return false;
    }));

  let gridContent;
  if (tenanciesLoading) {
    // Tenancies are loading
    gridContent = (
      <div className="no-data">
        <h3>Loading...</h3>
      </div>
    );
  } else {
    // Set grid content based on tenancy count.
    gridContent = tenancyCount === 0 ? (
      <div className="no-data">
        <h3>No Tenancies</h3>
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
                <th scope="col">Vehicle</th>
                <th scope="col">Nickname</th>
                <th scope="col">Plates</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenancyList.map(tenancy => (
                <TenancyItem key={tenancy.id} tenancy={tenancy} />
              ))}
            </tbody>
          </table>
        </div>
      );
  }

  return (
    <>
      <Row className="button-list align-items-center">
        {tenancyCount > 1 ? (
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

TenancyList.propTypes = {
  tenancyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  tenanciesLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  tenancyList: state.admin.tenancies,
  tenanciesLoading: state.admin.tenanciesLoading,
});

export default connect(
  mapStateToProps,
  null,
)(TenancyList);
