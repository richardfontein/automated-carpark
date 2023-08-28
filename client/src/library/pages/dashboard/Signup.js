import React from 'react';
import Navigation from '../../components/layout/header/Navigation';
import PageHeader from '../../components/layout/header/PageHeader';
import MainContent from '../../components/layout/body/MainContent';
import Footer from '../../components/layout/footer/Footer';

import SignupFormWrapper from '../../components/dashboard/signup/SignupFormWrapper';

export default function Signup(props) {
  return (
    <>
      <Navigation />
      <PageHeader title="Sign Up" />
      <MainContent>
        <SignupFormWrapper {...props} />
      </MainContent>
      <Footer />
    </>
  );
}
