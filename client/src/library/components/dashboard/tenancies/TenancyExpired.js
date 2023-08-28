import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { PrivateNamedRoute } from '../../../util/RouterUtil';

import TenancyListExpired from './TenancyListExpired';
import TenancyRenew from './TenancyRenew';

export default function TenancyExpired() {
  return (
    <Switch>
      <PrivateNamedRoute
        exact
        path="/dashboard/tenancies/expired"
        component={TenancyListExpired}
        title="Expired - Tenancies - Automated Carpark"
      />
      <PrivateNamedRoute
        exact
        path="/dashboard/tenancies/expired/renew/:id"
        component={TenancyRenew}
      />

      <Redirect to="/dashboard/tenancies/expired" />
    </Switch>
  );
}
