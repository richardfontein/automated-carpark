import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Navigation from '../../components/layout/header/Navigation';
import PageHeader from '../../components/layout/header/PageHeader';
import MainContent from '../../components/layout/body/MainContent';
import Footer from '../../components/layout/footer/Footer';
import { PrivateNamedRoute } from '../../util/RouterUtil';

import { Nav, Tab } from '../../components/nav/Nav';
import TenancyGeneral from '../../components/dashboard/tenancies/TenancyGeneral';
import TenancyExpired from '../../components/dashboard/tenancies/TenancyExpired';
import {
  getTenancies,
  getActiveTenanciesCount,
  getExpiredTenanciesCount,
} from '../../../actions/tenancyActions';

function Tenancy(props) {
  const { isAuthenticated } = props;
  useEffect(() => {
    if (isAuthenticated) {
      props.getTenancies();
    }

    // eslint-disable-next-line
  }, [isAuthenticated]);

  const { activeTenanciesCount, expiredTenanciesCount } = props;

  return (
    <>
      <Navigation />
      <PageHeader title="My Tenancies">
        <LinkContainer to="/dashboard/account/general">
          <Button variant="secondary">
            <FontAwesomeIcon icon="user-edit" className="mr-2" />
            Edit Profile
          </Button>
        </LinkContainer>
      </PageHeader>
      <MainContent>
        <Nav className="above-grid">
          <Tab to="/dashboard/tenancies/general">
            <strong>{activeTenanciesCount}</strong>
            {activeTenanciesCount === 1 ? ' Tenancy' : ' Tenancies'}
          </Tab>
          <Tab to="/dashboard/tenancies/expired">
            <strong>{expiredTenanciesCount}</strong>
            {' Expired'}
          </Tab>
        </Nav>

        <Switch>
          <PrivateNamedRoute
            path="/dashboard/tenancies/general"
            component={TenancyGeneral}
          />
          <PrivateNamedRoute
            path="/dashboard/tenancies/expired"
            component={TenancyExpired}
          />

          <Redirect to="/dashboard/tenancies/general" />
        </Switch>
      </MainContent>
      <Footer />
    </>
  );
}

Tenancy.propTypes = {
  getTenancies: PropTypes.func.isRequired,
  activeTenanciesCount: PropTypes.number.isRequired,
  expiredTenanciesCount: PropTypes.number.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  activeTenanciesCount: getActiveTenanciesCount(state),
  expiredTenanciesCount: getExpiredTenanciesCount(state),
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {
  getTenancies,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tenancy);
