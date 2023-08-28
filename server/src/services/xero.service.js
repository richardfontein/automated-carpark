import { AccountingAPIClient } from 'xero-node';
import path from 'path';
import { BadRequestError } from '../status/clientErrorCodes';

const BASE_URL = process.env.LIVE_BACKEND_URL;

const config = {
  appType: 'private',
  consumerKey: process.env.XERO_CONSUMER_KEY,
  consumerSecret: process.env.XERO_CONSUMER_SECRET,
  privateKeyPath: path.resolve(__dirname, '..', '..', 'privatekey.pem'),
};

const xero = new AccountingAPIClient(config);

export const getContact = async (xeroContactId) => {
  if (!xeroContactId) {
    return { data: {}, status: 200 };
  }

  try {
    const result = await xero.contacts.get({ ContactID: xeroContactId });

    if (result.Contacts.length !== 1) {
      return { data: {}, status: 200 };
    }

    return { data: result.Contacts[0], status: 200 };
  } catch (e) {
    throw new BadRequestError('Contact could not be fetched');
  }
};

export const getContacts = async () => {
  try {
    const result = await xero.contacts.get();

    return { data: result.Contacts, status: 200 };
  } catch (e) {
    throw new BadRequestError('Contacts could not be fetched');
  }
};

export const getInvoices = async (xeroContactId) => {
  if (!xeroContactId) {
    return { data: { data: [], has_more: false }, status: 200 };
  }

  try {
    const result = await xero.invoices.get({ ContactIDS: xeroContactId, order: 'Date' });

    const invoices = result.Invoices.map(invoice => ({
      id: invoice.InvoiceID,
      created: +new Date(invoice.DateString) / 1000,
      lines: {
        data: invoice.LineItems.map(lineItem => ({
          id: lineItem.LineItemID,
          description: lineItem.Description,
        })),
      },
      total: invoice.Total * 100,
      hosted_invoice_url: `${BASE_URL}/api/billing/invoices/xero/${invoice.InvoiceID}`,
      invoice_pdf: `${BASE_URL}/api/billing/invoices/pdf/${invoice.InvoiceID}`,
    }));
    const formattedData = { has_more: false, data: invoices.reverse() };

    return { data: formattedData, status: 200 };
  } catch (e) {
    throw new BadRequestError('Invoices could not be fetched');
  }
};

export const getXeroInvoiceUrl = async (xeroInvoiceId) => {
  try {
    const onlineUrl = await xero.invoices.onlineInvoice.get({ InvoiceID: xeroInvoiceId });
    const xeroUrl = onlineUrl.OnlineInvoices[0].OnlineInvoiceUrl;

    return await xeroUrl;
  } catch (e) {
    throw new BadRequestError('Invoice url could not be fetched');
  }
};

export const getXeroInvoicePdfUrl = async (xeroInvoiceId) => {
  try {
    const xeroUrl = await getXeroInvoiceUrl(xeroInvoiceId);
    const pdfUrl = `${xeroUrl}/Invoice/DownloadPdf`;

    return pdfUrl;
  } catch (e) {
    throw new BadRequestError('Invoice pdf could not be fetched');
  }
};
