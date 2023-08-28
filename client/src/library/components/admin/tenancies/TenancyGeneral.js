import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { AdminRoute } from '../../../util/RouterUtil';

import TenancyList from './TenancyList';
import TenancyEdit from './TenancyEdit';

export default function TenancyGeneral() {
  return (
    <Switch>
      <AdminRoute exact path="/admin/tenancies" component={TenancyList} title="Tenancies" />
      <AdminRoute exact path="/admin/tenancies/:id" component={TenancyEdit} title="Edit Tenancy" />

      <Redirect to="/admin/tenancies" />
    </Switch>
  );
}
