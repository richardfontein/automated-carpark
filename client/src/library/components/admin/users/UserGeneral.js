import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { AdminRoute } from '../../../util/RouterUtil';

import UserList from './UserList';
import UserAdd from './UserAdd';
import UserController from './UserController';

export default function UserGeneral() {
  return (
    <Switch>
      <AdminRoute exact path="/admin/users" component={UserList} title="Users" />
      <AdminRoute exact path="/admin/users/add" component={UserAdd} title="Add User" />
      <AdminRoute path="/admin/users/:id" component={UserController} />

      <Redirect to="/admin/users" />
    </Switch>
  );
}
