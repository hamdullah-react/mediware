import { APP_TIME_FORMAT, ISaleInvoice } from '@billinglib';
import { Divider, Spinner } from '@fluentui/react-components';
import { dashIfNull } from '../../../utils/common';
import moment from 'moment';
import Table from '../Table';
import { useMemo } from 'react';

interface Props {
  data?: ISaleInvoice;
}
const SalesViewer = ({ data }: Props) => {
  const invoiceData = useMemo(() => {
    if (data && data?.Items && data?.Items.length > 0) {
      return data?.Items.map((item) => ({
        Medicine: `${item.Medicine?.name} (${item.Medicine?.type})`,
        Packing: item.Medicine?.packing,
        Quantity: item.quantity,
        Rate: item.unitSalePrice,
        Total: item.unitSalePrice * item.quantity,
      }));
    }
    return [];
  }, [data]);

  const invoiceTotal = useMemo(() => {
    return (
      (data?.Items.map((it) => it.quantity * it.unitSalePrice)?.reduce(
        (a, b) => a + b,
        0
      ) ?? 0) - (data?.dicountPrice ?? 0)
    );
  }, [data]);

  return data ? (
    <div>
      <div className="flex justify-between">
        <table className="flex flex-col gap-1">
          <tbody>
            <tr>
              <td>Customer: </td>
              <td>{dashIfNull(data.customerName)}</td>
            </tr>

            <tr>
              <td>Telephone: </td>
              <td>{dashIfNull(data.telephone)}</td>
            </tr>
            <tr>
              <td>Whatsapp: </td>
              <td>{dashIfNull(data.whatsapp)}</td>
            </tr>
          </tbody>
        </table>
        <table className="flex flex-col gap-1">
          <tbody>
            <tr>
              <td>Date: </td>
              <td>
                {dashIfNull(moment(data.createAt).format(APP_TIME_FORMAT))}
              </td>
            </tr>
            <tr>
              <td>Email: </td>
              <td>{dashIfNull(data.email)}</td>
            </tr>
            <tr>
              <td>Address: </td>
              <td>{dashIfNull(data.address)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {invoiceData && <Table minHeight="min-h-[30vh]" data={invoiceData} />}
      <div className="text-end">
        <div className="text-md pt-3">Total: {invoiceTotal}</div>
        <div className="text-md pt-1">Discount: {data.dicountPrice}</div>
        <div className="text-md pt-1">Recieved: {data.totalRecieved}</div>
      </div>
      <Divider className="mt-4" />
    </div>
  ) : (
    <div className="p-6">
      <Spinner label={'Loading'} labelPosition="below" />
    </div>
  );
};

export default SalesViewer;
