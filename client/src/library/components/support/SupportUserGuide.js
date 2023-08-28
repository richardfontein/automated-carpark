import React from 'react';

export default function SupportUserGuide() {
  return (
    <>
      <div className="heading">
        <h2>User Guide</h2>
      </div>
      <strong>License Plate Recognition Camera</strong>
      <p>
        The carpark entry and exit system operates with 2 license plate recognition (LPR) cameras.
        Each Leaseholder can have 2 license plates for each Lease. The camera will recognise the
        number plate on entry and raise the barrier arm. The system will then register that the
        Leaseholder’s car is in the carpark. The LPR system has “anti-pass-back” technology, which
        dictates that the next action by the Leaseholder’s car must be to exit the carpark. The
        Leaseholder can not have their second car enter the carpark whilst the first car is still in
        the Carpark.
      </p>
      <strong>Car-Park Operating Hours</strong>
      <p>
        The Carpark is able to be used by Leaseholders on a 24/7 basis. For security purposes the
        roller security screen at the bottom of the ramp, and the staircase doors are closed from 12
        midnight to 5.30am.
      </p>
      <strong>Permanent &amp; Anytime Leaseholders</strong>
      <p>
        The Permanent Leaseholders are part of their Company’s Long Term Lease of the carpark and
        have full 24/7 access to the building. The Anytime Leaseholders have a Contract with ICL.
        Either the Leaseholder or ICL must provide the other party 3 months notice if they want to
        terminate the Lease arrangement, or if ICL intends to change the rental payment amount. If a
        Leaseholder leaves the employment for their Automated Precinct employer, ICL will allow
        rental payments to cease on the last verified date of their employment. Anytime Leaseholders
        will have full 24/7 access.
      </p>
      <strong>CCTV / Security Cameras</strong>
      <p>
        The building has a number of CCTV / Security Cameras. All video footage is saved and backed
        up. If any Leaseholder has any security concerns, please contact us. Similarly if any
        Leaseholder or member of the Public causes damage and this can be verified, the person(s)
        creating the damage will be required to pay for its repair.
      </p>
    </>
  );
}
