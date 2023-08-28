import React from 'react';
import PageHeader from '../../components/layout/header/PageHeader';
import Navigation from '../../components/layout/header/Navigation';
import MainContent from '../../components/layout/body/MainContent';
import Footer from '../../components/layout/footer/Footer';

import ForgotForm from '../../components/dashboard/forgot/ForgotForm';

export default function Forgot(props) {
  return (
    <>
      <Navigation />
      <PageHeader title="Forgot Password" />
      <MainContent>
        <ForgotForm {...props} />
      </MainContent>
      <Footer />
    </>
  );
}
