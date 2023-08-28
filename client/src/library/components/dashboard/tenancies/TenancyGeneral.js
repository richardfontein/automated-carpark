import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { PrivateNamedRoute } from '../../../util/RouterUtil';

import TenancyList from './TenancyList';
import TenancyAdd from './TenancyAdd';
import TenancyEdit from './TenancyEdit';

export default function TenancyGeneral() {
  return (
    <Switch>
      <PrivateNamedRoute
        exact
        path="/dashboard/tenancies/general"
        component={TenancyList}
        title="General - Tenancies - Automated Carpark"
      />
      <PrivateNamedRoute exact path="/dashboard/tenancies/general/add" component={TenancyAdd} />
      <PrivateNamedRoute
        exact
        path="/dashboard/tenancies/general/edit/:id"
        component={TenancyEdit}
      />

      <Redirect to="/dashboard/tenancies/general" />
    </Switch>
  );
}
