import React from 'react';
import Navigation from '../../components/layout/header/Navigation';
import PageHeader from '../../components/layout/header/PageHeader';
import MainContent from '../../components/layout/body/MainContent';
import Footer from '../../components/layout/footer/Footer';

import ResetForm from '../../components/dashboard/reset/ResetForm';

export default function Reset(props) {
  return (
    <>
      <Navigation />
      <PageHeader title="Password Reset" />
      <MainContent>
        <ResetForm {...props} />
      </MainContent>
      <Footer />
    </>
  );
}
