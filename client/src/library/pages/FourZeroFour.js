import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Navigation from '../components/layout/header/Navigation';
import PageHeader from '../components/layout/header/PageHeader';
import MainContent from '../components/layout/body/MainContent';
import Footer from '../components/layout/footer/Footer';

const style = {
  button: { marginTop: '1rem' },
  error: { textAlign: 'center', marginTop: '1rem' },
};

export default function FourZeroFour() {
  return (
    <>
      <Navigation />
      <PageHeader title="Page not found" />
      <MainContent>
        <div style={style.error}>
          <h1>404</h1>
          <h3>This page does not exist.</h3>
          <LinkContainer to="/" style={style.button}>
            <Button>Back to home page</Button>
          </LinkContainer>
        </div>
      </MainContent>
      <Footer />
    </>
  );
}
