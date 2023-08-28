import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Navigation from '../../components/layout/header/Navigation';
import PageHeader from '../../components/layout/header/PageHeader';
import MainContent from '../../components/layout/body/MainContent';
import Footer from '../../components/layout/footer/Footer';
import { PrivateNamedRoute } from '../../util/RouterUtil';

import AccountNav from '../../components/dashboard/account/AccountNav';
import AccountGeneral from '../../components/dashboard/account/general/AccountGeneral';
import AccountBilling from '../../components/dashboard/account/billing/AccountBilling';
import AccountPassword from '../../components/dashboard/account/password/AccountPassword';

export default function Account(props) {
  return (
    <>
      <Navigation />
      <PageHeader title="Account Settings">
        <LinkContainer to="/dashboard/tenancies/general">
          <Button variant="secondary">
            <FontAwesomeIcon icon="list" className="mr-2" />
            Back to Tenancies
          </Button>
        </LinkContainer>
      </PageHeader>
      <MainContent>
        <AccountNav {...props} aboveSettings />
        <div className="main-content">
          <Switch>
            <PrivateNamedRoute
              path="/dashboard/account/general"
              component={AccountGeneral}
              title="General - Account - Automated Carpark"
            />
            <PrivateNamedRoute
              exact
              path="/dashboard/account/billing"
              component={AccountBilling}
              title="Billing - Account - Automated Carpark"
            />
            <PrivateNamedRoute
              exact
              path="/dashboard/account/password"
              component={AccountPassword}
              title="Password - Account - Automated Carpark"
            />

            <Redirect to="/dashboard/account/general" />
          </Switch>
        </div>
      </MainContent>
      <Footer />
    </>
  );
}
