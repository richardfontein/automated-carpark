import React from 'react';
import Navigation from '../../components/layout/header/Navigation';
import PageHeader from '../../components/layout/header/PageHeader';
import MainContent from '../../components/layout/body/MainContent';
import Footer from '../../components/layout/footer/Footer';

import LoginFormWrapper from '../../components/dashboard/login/LoginFormWrapper';

export default function Login(props) {
  return (
    <>
      <Navigation />
      <PageHeader title="Log In" />
      <MainContent>
        <LoginFormWrapper {...props} />
      </MainContent>
      <Footer />
    </>
  );
}
