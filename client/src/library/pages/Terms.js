import React from 'react';
import Navigation from '../components/layout/header/Navigation';
import PageHeader from '../components/layout/header/PageHeader';
import MainContent from '../components/layout/body/MainContent';
import Footer from '../components/layout/footer/Footer';

export default function Terms() {
  return (
    <>
      <Navigation />
      <PageHeader title="Terms &amp; Conditions" />
      <MainContent>
        <div className="terms">
          <h4>1. Parking Allocation</h4>
          <p>
            All parking is on a “non – allocated” parking bay basis. Eligible
            parkers can park in any parking bay, except where carparks are
            provided for visitors or short term parking on the lower levels.
          </p>
          <h4>2. Parking Options</h4>
          <p>The following Parking Options are available.</p>
          <ol>
            <li>
              <strong>Anytime - </strong>
              24 hours a day, 7 days a week. 3 months notice to terminate from
              either party.
              <strong> $224.25 per month (GST incl.)</strong>
            </li>
            <li>
              <strong>Long Term Lease - </strong>
              24 hours a day, 7 days a week. Opex and Rent reviews as per the
              Lease documentation.
              <br />
              ICL will manage a ‘trading’ system that enables a property owner
              to increase or decrease its number of long term leased carparks
              over time, with other property owners.
            </li>
          </ol>
          <h4>3. Parking Termination</h4>
          <p>
            ICL reserve the right to change the pricing for ‘Anytime’ based on
            future demand, by giving 3 months notice to do so to Leaseholders.
            The Price of ‘Anytime’ is likely to increase in time.
          </p>
        </div>
      </MainContent>
      <Footer />
    </>
  );
}
