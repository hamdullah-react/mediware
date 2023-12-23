import { APP_ROUNDOFF_SETTING, APP_TIME_FORMAT, IInvoice } from '@billinglib';
import { Divider } from '@fluentui/react-components';
import { dashIfNull } from '../../utils/common';
import moment from 'moment';
import Table from './Table';
import { useCallback } from 'react';

interface Props {
  invoice?: IInvoice;
}

const InvoiceViewer = ({ invoice }: Props) => {
  const getFilteredHeader = useCallback(() => {
    if (invoice) {
      const returnable = invoice.InvoiceMedicine;
      return returnable?.map((medicine) => ({
        Name: medicine.Medicine?.name,
        Packing: medicine.Medicine?.packing,
        Batch: medicine.batchIdentifier,
        Expirey: moment(medicine.expirey).format(APP_TIME_FORMAT),
        Quantity: medicine.quantity,
        'Unit Price': medicine.unitSalePrice,
        'Gross Amt': (medicine.unitSalePrice * medicine.quantity).toFixed(
          APP_ROUNDOFF_SETTING
        ),
        'Dis %': medicine?.discountPercentage,
        'Adv.Tax': medicine?.advTax,
        'Net Amount': medicine.netAmount?.toFixed(APP_ROUNDOFF_SETTING),
      }));
    } else return [];
  }, []);

  return invoice ? (
    <div>
      <div>
        <div className="flex flex-row py-3">
          <div className="flex-1">
            {invoice.Supplier?.telephones && (
              <div>Telephone {dashIfNull(invoice.Supplier?.telephones)}</div>
            )}
            {invoice.Supplier?.emails && (
              <div>Email {dashIfNull(invoice.Supplier?.emails)}</div>
            )}
            {invoice.Supplier?.licenseNumber && (
              <div>License {dashIfNull(invoice.Supplier?.licenseNumber)}</div>
            )}
            {invoice.Supplier?.city && (
              <div>City {dashIfNull(invoice.Supplier?.city)}</div>
            )}
          </div>
          <div className="flex-1 flex-col flex justify-start items-center text-center">
            <div className="text-3xl font-semibold">
              {invoice.Supplier?.name}
            </div>
            <div>
              {dashIfNull(
                invoice.Supplier?.addressLine1 ??
                  '' + invoice.Supplier?.addressLine2 ??
                  ''
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end">
            {invoice.Supplier?.NTN && (
              <div>NTN {dashIfNull(invoice.Supplier?.NTN)}</div>
            )}
            {invoice.Supplier?.STN && (
              <div>STN {dashIfNull(invoice.Supplier?.STN)}</div>
            )}
            {invoice.Supplier?.TNNumber && (
              <div>TNNumber {dashIfNull(invoice.Supplier?.TNNumber)}</div>
            )}
            {invoice.Supplier?.TRNNumber && (
              <div>TRNNumber {dashIfNull(invoice.Supplier?.TRNNumber)}</div>
            )}
            {!!invoice?.createdAt && (
              <div>
                <b>Date</b> {moment(invoice.createdAt).format('DD/MM/YYYY')}{' '}
                <b>Time</b> {moment(invoice.createdAt).format('HH:mm:ss')}
              </div>
            )}
          </div>
        </div>
      </div>
      <Divider className="py-3" />
      <Table
        data={getFilteredHeader() as unknown as []}
        minHeight="min-h-[50vh]"
      />
    </div>
  ) : (
    <div></div>
  );
};

export default InvoiceViewer;
