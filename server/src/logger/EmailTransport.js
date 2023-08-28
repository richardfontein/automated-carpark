import nodemailer from 'nodemailer';
import Transport from 'winston-transport';
import aws from 'aws-sdk';

const { EMAIL_FROM, EMAIL_ERROR } = process.env;

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

const sendError = async (error) => {
  const mailOptions = {
    from: { name: 'Automated Carpark Errors', address: EMAIL_FROM },
    to: EMAIL_ERROR,
    subject: 'Automated Carpark Error',
    text: error,
  };

  try {
    return smtpTransport.sendMail(mailOptions);
  } catch (e) {
    throw e;
  }
};

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
// eslint-disable-next-line import/prefer-default-export
export default class EmailTransport extends Transport {
  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      await sendError(info.message);
    } catch (e) {
      // Message could not be delivered
    }

    callback();
  }
}
