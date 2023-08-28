import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import FormattedSelectButtonList from '../../button/FormattedSelectButtonList';
import TenancyItem from './TenancyItem';
import { sortArray } from './util';
import { getActiveTenancies, deleteTenancy } from '../../../../actions/tenancyActions';

function TenancyList({
 tenancyList, deleteItem, isLoading, corporateCarparks, 
}) {
  // Define sort keys
  const sortKeys = {
    'Start Date': 'startDate',
    'End Date': 'endDate',
    Vehicle: 'vehicleType',
    Nickname: 'nickname',
  };

  const tenancyCount = tenancyList.length;
  const isCorporate = corporateCarparks !== undefined && corporateCarparks !== 0;

  // Define sort parameters
  const defaultSortBy = 'startDate';
  const [sortBy, setSortBy] = useState(defaultSortBy);
  sortArray(tenancyList, sortBy, defaultSortBy);

  const handleSelect = (key) => {
    const sortKey = sortKeys[key];
    setSortBy(sortKey);
    sortArray(tenancyList, sortKey, defaultSortBy);
  };

  let gridContent;

  if (isLoading) {
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
        tenancyList.map(tenancy => (
          <TenancyItem
            key={tenancy.id}
            tenancy={tenancy}
            deleteItem={deleteItem}
            isCorporate={isCorporate}
          />
        ))
      );
  }

  return (
    <>
      <Row className="button-list align-items-center">
        {corporateCarparks !== undefined
        && (corporateCarparks === 0 || tenancyCount < corporateCarparks) ? (
          <Col lg="auto">
            <LinkContainer exact to="/dashboard/tenancies/general/add">
              <Button variant="secondary">New Tenancy</Button>
            </LinkContainer>
          </Col>
        ) : null}
        {corporateCarparks !== undefined && corporateCarparks !== 0 ? (
          <Col className="button-description mt-3 mt-lg-0">
            <strong>{`${tenancyCount} `}</strong>
            <span> of </span>
            <strong>{corporateCarparks}</strong>
            <span> carparks allocated.</span>
          </Col>
        ) : null}
        {tenancyCount > 1 ? (
          <FormattedSelectButtonList
            keyList={Object.keys(sortKeys)}
            onSelect={handleSelect}
            description="Sort by:"
          />
        ) : null}
      </Row>

      <div className="grid-container">{gridContent}</div>
    </>
  );
}

TenancyList.defaultProps = {
  corporateCarparks: undefined,
};

TenancyList.propTypes = {
  tenancyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  corporateCarparks: PropTypes.number,
};

const mapStateToProps = state => ({
  tenancyList: getActiveTenancies(state),
  isLoading: state.tenancy.tenanciesLoading,
  corporateCarparks: state.auth.user.corporateCarparks,
});

const mapDispatchToProps = {
  deleteItem: deleteTenancy,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TenancyList);
