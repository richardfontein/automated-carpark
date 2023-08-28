import nodemailer from 'nodemailer';
import aws from 'aws-sdk';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import fs from 'fs';
import { format as formatDate } from 'date-fns';
import { userDb, tenancyDb } from '../db';
import { BadRequestError } from '../status/clientErrorCodes';

const BASE_URL = process.env.LIVE_FRONTEND_URL;
const logo = fs.readFileSync(path.join(__dirname, 'templates', 'res', 'logo.svg'), 'utf8');

const handlebarsOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.join(__dirname, 'templates', 'partials'),
    layoutsDir: path.join(__dirname, 'templates', 'layouts'),
    defaultLayout: 'main.hbs',
  },
  viewPath: path.join(__dirname, 'templates', 'views'),
  extName: '.hbs',
};

const smtpTransport = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: process.env.AWS_SES_API_VERSION,
    region: process.env.AWS_SES_REGION,
    credentials: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    },
  }),
});

const { EMAIL_BILLING_REPLY_TO, EMAIL_FROM } = process.env;

smtpTransport.use('compile', hbs(handlebarsOptions));

export const sendPasswordToken = async (user) => {
  try {
    const mailOptions = {
      from: {
        name: 'Automated Carpark',
        address: EMAIL_FROM,
      },
      to: user.email,
      subject: 'Reset your password',
      template: 'reset',
      context: {
        baseUrl: BASE_URL,
        logo,
        title: 'Forgot Your Password?',
        url: `/dashboard/reset/${user.resetPasswordToken}`,
      },
      text: `We heard you lost your password. If you really did, click the button below to change your password. The link will expire in 1 hour.

${BASE_URL}/dashboard/reset/${user.resetPasswordToken}
  
Thank you,
Automated Carpark

160 Lichfield St,
Christchurch 8011,
New Zealand
`,
    };

    return smtpTransport.sendMail(mailOptions);
  } catch (e) {
    throw e;
  }
};

export const sendReceiptSuccess = async (invoice) => {
  try {
    const {
      name,
      email,
      stripeInvoiceId,
      stripeInvoiceUrl,
      subtotal,
      total,
      date,
      invoiceItems,
    } = invoice;

    const formattedDate = formatDate(date, 'dd/MM/yyyy');
    const formattedTotal = (total / 100).toFixed(2);
    const formattedSubtotal = (subtotal / 100).toFixed(2);
    const formattedInvoiceItems = invoiceItems.map(({ amount, description }) => ({
      amount: (amount / 100).toFixed(2),
      description,
    }));

    const mailOptions = {
      from: {
        name: 'Automated Carpark',
        address: EMAIL_FROM,
      },
      replyTo: EMAIL_BILLING_REPLY_TO,
      to: email,
      subject: 'Your Automated Carpark Receipt',
      template: 'receiptSuccess',
      context: {
        baseUrl: BASE_URL,
        logo,
        title: 'Automated Carpark Receipt',
        name,
        stripeInvoiceId,
        stripeInvoiceUrl,
        formattedTotal,
        formattedSubtotal,
        formattedDate,
        formattedInvoiceItems,
      },
      text: `Hi there,

Thank you for parking with us! Here is your receipt.

${name}
Date: ${formattedDate}
Amount: ${formattedTotal}

You can view a list of all your charges and invoices here: 
${BASE_URL}/dashboard/account/billing

If you have any questions, don't hesitate to reach out to us!

Thank you,
Automated Carpark

160 Lichfield St,
Christchurch 8011,
New Zealand
`,
    };

    return smtpTransport.sendMail(mailOptions);
  } catch (e) {
    throw e;
  }
};

export const sendReceiptFailed = async (invoice) => {
  try {
    const {
      email, subtotal, total, invoiceItems,
    } = invoice;

    const formattedTotal = (total / 100).toFixed(2);
    const formattedSubtotal = (subtotal / 100).toFixed(2);
    const formattedInvoiceItems = invoiceItems.map(({ amount, description }) => ({
      amount: (amount / 100).toFixed(2),
      description,
    }));

    const mailOptions = {
      from: {
        name: 'Automated Carpark',
        address: EMAIL_FROM,
      },
      replyTo: EMAIL_BILLING_REPLY_TO,
      to: email,
      subject: 'Your Carpark Payment Failed',
      template: 'receiptFailed',
      context: {
        baseUrl: BASE_URL,
        logo,
        title: 'Automated Carpark Receipt',
        formattedTotal,
        formattedSubtotal,
        formattedInvoiceItems,
      },
      text: `Hi there,

Your carpark is on hold due to payment failure.

Amount Due: ${formattedTotal}

Please update your payment details to continue using the carpark.
You may do so through our website:
${BASE_URL}/dashboard/account/billing

If you have any questions, don't hesitate to reach out to us!

Thank you,
Automated Carpark

160 Lichfield St,
Christchurch 8011,
New Zealand
`,
    };

    return smtpTransport.sendMail(mailOptions);
  } catch (e) {
    throw e;
  }
};

export const sendContactQuery = async (query) => {
  try {
    const { subject, email, message } = query;

    let user;
    let tenancies;
    try {
      user = await userDb.getUserByEmail(email);
      tenancies = await tenancyDb.getTenancies(user.id);
      tenancies = tenancies.get();
      tenancies = tenancies
        .filter(tenancy => tenancy.subscriptionStarted && !tenancy.subscriptionEnded)
        .map(tenancy => ({
          vehicleType: tenancy.vehicleType,
          plates: tenancy.plates.map(plate => plate.registration).join(', '),
          startDate: formatDate(tenancy.startDate, 'dd/MM/yyyy'),
          endDate: tenancy.endDate ? formatDate(tenancy.endDate, 'dd/MM/yyyy') : null,
        }));
    } catch (e) {
      user = null;
      tenancies = null;
    }

    const name = user ? `${user.firstName} ${user.lastName}` : email;

    const mailOptions = {
      from: {
        name: 'Automated Carpark Query',
        address: EMAIL_FROM,
      },
      to: subject === 'Account or Billing' ? EMAIL_BILLING_REPLY_TO : EMAIL_FROM,
      replyTo: { name, address: email },
      subject: `Automated Carpark Query: ${subject}`,
      template: 'contactQuery',
      context: {
        logo,
        title: `Automated Carpark Query: ${subject}`,
        name,
        subject,
        message: message.replace(/(\r\n|\n|\r)/gm, '<br>'),
        tenancies,
      },
      text: `Hi team,

A message has been received from ${name}

Subject: ${subject}

${message}
`,
    };

    return smtpTransport.sendMail(mailOptions);
  } catch (e) {
    throw new BadRequestError(
      'Your message could not be delivered, please try again later.',
      'form',
    );
  }
};
