import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';

import FormattedSelectButtonList from '../../button/FormattedSelectButtonList';
import TenancyItem from './TenancyItem';
import { sortArray } from './util';
import { getExpiredTenancies, deleteTenancy } from '../../../../actions/tenancyActions';

function TenancyListExpired({
 tenancyList, deleteItem, isLoading, corporateCarparks, 
}) {
  // Define sort keys
  const sortKeys = {
    'Start Date': 'startDate',
    'End Date': 'endDate',
    Vehicle: 'vehicleType',
    Nickname: 'nickname',
  };

  // Extract tenancies from props
  const tenancyExpiredCount = tenancyList.length;
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
    gridContent = tenancyExpiredCount === 0 ? (
      <div className="no-data">
        <h3>No Expired Tenancies</h3>
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
      <Row className="button-list">
        {tenancyExpiredCount > 1 ? (
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

TenancyListExpired.defaultProps = {
  corporateCarparks: undefined,
};

TenancyListExpired.propTypes = {
  tenancyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  corporateCarparks: PropTypes.number,
};

const mapStateToProps = state => ({
  tenancyList: getExpiredTenancies(state),
  isLoading: state.tenancy.tenanciesLoading,
  corporateCarparks: state.auth.user.corporateCarparks,
});

const mapDispatchToProps = {
  deleteItem: deleteTenancy,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TenancyListExpired);
