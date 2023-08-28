import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { Nav, Tab } from '../components/nav/Nav';
import Navigation from '../components/layout/header/Navigation';
import { NamedRoute } from '../util/RouterUtil';

import SupportContact from '../components/support/SupportContact';
import SupportUserGuide from '../components/support/SupportUserGuide';
import SupportFaq from '../components/support/SupportFaq';
import Footer from '../components/layout/footer/Footer';
import MainContent from '../components/layout/body/MainContent';
import PageHeader from '../components/layout/header/PageHeader';

export default function Support() {
  return (
    <>
      <Navigation />
      <PageHeader title="Support" />
      <MainContent>
        <Row>
          <Col sm={3}>
            <Nav className="flex-column nav-vertical">
              <Tab to="/support/contact">Contact Us</Tab>
              <Tab to="/support/user-guide">User Guide</Tab>
              <Tab to="/support/faq">FAQ</Tab>
            </Nav>
          </Col>
          <Col sm={9}>
            <Switch>
              <NamedRoute
                exact
                path="/support/contact"
                component={SupportContact}
                title="Contact - Support - Automated Carpark"
              />
              <NamedRoute
                exact
                path="/support/user-guide"
                component={SupportUserGuide}
                title="User Guide - Support - Automated Carpark"
              />
              <NamedRoute
                exact
                path="/support/faq"
                component={SupportFaq}
                title="FAQ - Support - Automated Carpark"
              />

              <Redirect to="/support/contact" />
            </Switch>
          </Col>
        </Row>
      </MainContent>
      <Footer />
    </>
  );
}
