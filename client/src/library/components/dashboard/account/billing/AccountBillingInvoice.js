import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { format as formatDate } from 'date-fns';

import { loadInvoices } from '../../../../../actions/billingActions';

function AccountBillingInvoice(props) {
  useEffect(() => {
    props.loadInvoices();
    // eslint-disable-next-line
  }, []);

  const { invoiceList, hasMore, isLoading } = props;

  // Show loading icon
  if (isLoading && !hasMore) {
    return <span>Loading...</span>;
  }

  const loadMoreInvoices = () => {
    props.loadInvoices(invoiceList.slice(-1)[0].id);
  };

  const gridContent = invoiceList.length === 0 ? (
      'No invoices to show.'
    ) : (
      <Table bordered responsive>
        <tbody>
          {invoiceList.map(invoice => (
            <tr key={invoice.id}>
              <td>
                <strong>{formatDate(invoice.created * 1000, 'MMMM do yyyy')}</strong>
              </td>
              <td>
                <Table borderless style={{ margin: 0 }}>
                  <tbody>
                    {invoice.lines.data.map(invoiceItem => (
                      <tr key={invoiceItem.id}>
                        <td style={{ padding: 0 }}>{invoiceItem.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
              <td>
                <a href={invoice.hosted_invoice_url} target="_blank" rel="noreferrer noopener">
                  {`NZD ${(invoice.total / 100).toFixed(2)}`}
                </a>
              </td>
              <td>
                <a href={invoice.invoice_pdf} target="_blank" rel="noreferrer noopener">
                  Download as PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );

  return (
    <div className="invoices">
      {gridContent}
      <div className="actions-row" style={{ display: hasMore ? 'block' : 'none' }}>
        <Button onClick={loadMoreInvoices} variant="secondary">
          Show More
        </Button>
      </div>
    </div>
  );
}

AccountBillingInvoice.propTypes = {
  loadInvoices: PropTypes.func.isRequired,
  invoiceList: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
};

AccountBillingInvoice.propTypes = {
  loadInvoices: PropTypes.func.isRequired,
  invoiceList: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  invoiceList: state.billing.invoices,
  hasMore: state.billing.hasMore,
  isLoading: state.billing.invoicesLoading,
});

const mapDispatchToProps = { loadInvoices };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountBillingInvoice);
