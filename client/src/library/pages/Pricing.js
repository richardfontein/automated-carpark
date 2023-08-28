import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import Navigation from '../components/layout/header/Navigation';
import PageHeader from '../components/layout/header/PageHeader';
import MainContent from '../components/layout/body/MainContent';
import Footer from '../components/layout/footer/Footer';

import FormattedSelectButtonList from '../components/button/FormattedSelectButtonList';
import { Plan, Feature } from '../components/pricing/Plan';

export default function Pricing() {
  const [vehicleType, setVehicleType] = useState('Car');
  const handleSelect = key => setVehicleType(key);
  const priceList = { Car: 224.25, Motorbike: 100, Bicycle: 50 };

  return (
    <>
      <Navigation />
      <PageHeader title="Pricing" />
      <MainContent>
        <div className="main-content">
          <Row className="heading">
            <Col>
              <h2>Parking Plans</h2>
              <p>Choose a parking plan that suits your needs.</p>
            </Col>
            <FormattedSelectButtonList
              keyList={Object.keys(priceList)}
              onSelect={handleSelect}
              defaultActiveKey="Car"
              description="Vehicle type:"
            />
          </Row>
          <Row className="plan-grid">
            <Plan show={vehicleType !== 'Bicycle'}>
              <Plan.Header>
                <Plan.Title>Casual</Plan.Title>
                <Plan.Cost cost={3} unit="hour">
                  Per hour billed half-hourly
                </Plan.Cost>
                <Plan.Description>
                  Public parking for access to a wide variety of restaurants and
                  hospitality venues within the Automated Precinct.
                </Plan.Description>
              </Plan.Header>
              <Plan.Feature>
                <Feature.Item>Secure Vehicle Parking</Feature.Item>
                <Feature.Item>Access: 5AM - Midnight</Feature.Item>
                <Feature.Item>Car &amp; Motorbike Access</Feature.Item>
                <Feature.Item not>No Bicycle Parking</Feature.Item>
                <Feature.Item not>No License Plate Recognition</Feature.Item>
                <Feature.Item not>No Team Dashboard</Feature.Item>
              </Plan.Feature>
              <a
                href="https://goo.gl/maps/jS1idd5xY2FzfQJLA"
                className="w-100 btn btn-primary"
                target="_blank"
                rel="noreferrer noopener"
              >
                Get Directions
              </a>
            </Plan>

            <Plan>
              <Plan.Header>
                <Plan.Title>Individual</Plan.Title>
                <Plan.Cost cost={priceList[vehicleType]} unit="month">
                  Per month billed monthly
                </Plan.Cost>
                <Plan.Description>
                  Our most popular plan, includes 24/7 access to secure parking.
                  Ideal for workers within the Automated Precinct.
                </Plan.Description>
              </Plan.Header>
              <Plan.Feature>
                <Feature.Item>Secure Vehicle Parking</Feature.Item>
                <Feature.Item>Access: 24/7</Feature.Item>
                <Feature.Item>Car &amp; Motorbike Access</Feature.Item>
                <Feature.Item>Secure Bicycle Parking</Feature.Item>
                <Feature.Item>License Plate Recognition</Feature.Item>
                <Feature.Item not>No Team Dashboard</Feature.Item>
              </Plan.Feature>
              <Plan.Button to="/dashboard/signup">Get Started</Plan.Button>
            </Plan>

            <Plan>
              <Plan.Header>
                <Plan.Title>Team</Plan.Title>
                <Plan.Cost cost={priceList[vehicleType]} unit="user">
                  Per month billed monthly
                </Plan.Cost>
                <Plan.Description>
                  For teams seeking a large number of carparks with a team
                  dashboard to easily manage carpark requirements.
                </Plan.Description>
              </Plan.Header>
              <Plan.Feature>
                <Feature.Item>Secure Vehicle Parking</Feature.Item>
                <Feature.Item>Access: 24/7</Feature.Item>
                <Feature.Item>Car &amp; Motorbike Access</Feature.Item>
                <Feature.Item>Secure Bicycle Parking</Feature.Item>
                <Feature.Item>License Plate Recognition</Feature.Item>
                <Feature.Item>Team Dashboard</Feature.Item>
              </Plan.Feature>
              <Plan.Button to="/dashboard/signup">Get Started</Plan.Button>
            </Plan>
          </Row>
        </div>
      </MainContent>
      <Footer />
    </>
  );
}
