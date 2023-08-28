import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { AdminRoute } from '../../../util/RouterUtil';

import AdminList from './AdminList';
import AdminAdd from './AdminAdd';
import AdminEdit from './AdminEdit';

export default function AdminGeneral() {
  return (
    <Switch>
      <AdminRoute exact path="/admin/general" component={AdminList} title="Admin" />
      <AdminRoute exact path="/admin/general/add" component={AdminAdd} title="Add Admin" />
      <AdminRoute exact path="/admin/general/:id" component={AdminEdit} title="Edit Admin" />

      <Redirect to="/admin/general" />
    </Switch>
  );
}
