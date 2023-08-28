import React, { useEffect } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NamedRoute } from './library/util/RouterUtil';
import store from './library/components/store';
import ErrorBoundary from './library/util/ErrorBoundary';

import Home from './library/pages/Home';
import Pricing from './library/pages/Pricing';
import Terms from './library/pages/Terms';
import Support from './library/pages/Support';
import Dashboard from './library/pages/Dashboard';
import Admin from './library/pages/Admin';
import FourZeroFour from './library/pages/FourZeroFour';

import { loadUser } from './actions/authActions';

export default function App() {
  // Load user on app load
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="main-wrapper">
          <ErrorBoundary>
            <Switch>
              <NamedRoute
                exact
                path="/"
                component={Home}
                title="Automated Carpark"
              />
              <NamedRoute
                path="/pricing"
                component={Pricing}
                title="Pricing - Automated Carpark"
              />
              <NamedRoute
                exact
                path="/terms"
                component={Terms}
                title="Terms - Automated Carpark"
              />
              <NamedRoute path="/support" component={Support} />
              <NamedRoute path="/dashboard" component={Dashboard} />

              <NamedRoute path="/admin" component={Admin} />

              <NamedRoute component={FourZeroFour} title="Page not found" />
            </Switch>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </Provider>
  );
}
