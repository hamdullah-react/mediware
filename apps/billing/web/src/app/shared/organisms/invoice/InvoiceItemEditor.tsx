import {
  APP_ROUNDOFF_SETTING,
  APP_UI_FORM_DATE_FORMAT,
  IInvoiceMedicine,
} from '@billinglib';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { sanitizeNaN } from '../../../utils/common';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@fluentui/react-components';
import InputField from '../../molecules/InputField';
import moment from 'moment';

interface Props {
  invoiceItem: IInvoiceMedicine;
  onUpdate: (updated: IInvoiceMedicine) => void;
}

const InvoiceItemEditor = ({
  invoiceItem: orginalInvoiceItem,
  onUpdate,
}: Props) => {
  const [invoiceItem, setInvoiceItem] =
    useState<IInvoiceMedicine>(orginalInvoiceItem);

  const calculateNetTotals = () => {
    const total =
      parseFloat(sanitizeNaN(String(invoiceItem.unitSalePrice))) *
      parseFloat(sanitizeNaN(String(invoiceItem.quantity)));

    const discountAmount =
      parseFloat(sanitizeNaN(String(invoiceItem.unitSalePrice))) *
      (parseFloat(sanitizeNaN(String(invoiceItem.discountPercentage))) / 100) *
      parseFloat(sanitizeNaN(String(invoiceItem.quantity)));

    const gstTotal =
      (parseFloat(sanitizeNaN(String(invoiceItem?.gst))) ?? 0) *
      parseFloat(sanitizeNaN(String(invoiceItem.quantity)));

    setInvoiceItem({
      ...invoiceItem,
      discountedAmount: invoiceItem.discountedAmount,
      netAmount:
        parseFloat(sanitizeNaN(String(total))) +
        parseFloat(sanitizeNaN(String(gstTotal))) -
        parseFloat(sanitizeNaN(String(discountAmount))) +
        parseInt(sanitizeNaN(String(invoiceItem.advTax))),
    });
  };

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setInvoiceItem({
        ...invoiceItem,
        [ev.target.name]: ev.target.value,
      });
    },
    [invoiceItem]
  );

  const handleSubmit = useCallback(() => {
    onUpdate(invoiceItem);
  }, [invoiceItem]);

  useEffect(calculateNetTotals, [
    invoiceItem.unitSalePrice,
    invoiceItem.discountPercentage,
    invoiceItem.quantity,
    invoiceItem.gst,
    invoiceItem.advTax,
  ]);

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Batch Identifier</TableCell>
            <TableCell>
              <InputField
                name="batchIdentifier"
                onChange={handleChange}
                value={invoiceItem.batchIdentifier}
                placeholder="Enter Batch Number"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Expirey</TableCell>
            <TableCell>
              <InputField
                name="expirey"
                onChange={handleChange}
                value={moment(invoiceItem.expirey).format(
                  APP_UI_FORM_DATE_FORMAT
                )}
                placeholder="Enter Batch Number"
                type="date"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Unit Price</TableCell>
            <TableCell>
              <InputField
                name="unitSalePrice"
                onChange={handleChange}
                value={sanitizeNaN(String(invoiceItem.unitSalePrice))}
                type="number"
                min={1}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Quantity</TableCell>
            <TableCell>
              <InputField
                name="quantity"
                onChange={handleChange}
                value={sanitizeNaN(String(invoiceItem.quantity))}
                type="number"
                min={0}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount %</TableCell>
            <TableCell>
              <InputField
                name="discountPercentage"
                onChange={handleChange}
                value={sanitizeNaN(String(invoiceItem.discountPercentage))}
                type="number"
                min={0}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Adv. Tax</TableCell>
            <TableCell>
              <InputField
                name="advTax"
                onChange={handleChange}
                value={sanitizeNaN(String(invoiceItem.advTax))}
                type="number"
                min={0}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>GST</TableCell>
            <TableCell>
              <InputField
                name="gst"
                onChange={handleChange}
                value={sanitizeNaN(String(invoiceItem.gst))}
                type="number"
                min={0}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>
              {(invoiceItem.quantity * invoiceItem.unitSalePrice).toFixed(
                APP_ROUNDOFF_SETTING
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount Amount</TableCell>
            <TableCell>
              {(
                invoiceItem.unitSalePrice *
                (invoiceItem.discountPercentage / 100) *
                invoiceItem.quantity
              ).toFixed(APP_ROUNDOFF_SETTING)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Net Amount</TableCell>
            <TableCell>
              {invoiceItem.netAmount.toFixed(APP_ROUNDOFF_SETTING)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="pt-6 flex justify-end">
        <Button onClick={handleSubmit}>Update</Button>
      </div>
    </div>
  );
};

export default InvoiceItemEditor;
