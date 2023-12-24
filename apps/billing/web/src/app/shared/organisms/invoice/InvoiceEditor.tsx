import { APP_ROUNDOFF_SETTING, APP_TIME_FORMAT, IInvoice } from '@billinglib';
import { Button, Divider } from '@fluentui/react-components';
import { dashIfNull, sanitizeNaN } from '../../../utils/common';
import moment from 'moment';
import Table from '../Table';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';
import InputField from '../../molecules/InputField';
import Modal from '../Modal';
import InvoiceItemPicker from './InvoiceItemPicker';
import InvoiceItemEditor from './InvoiceItemEditor';

interface Props {
  invoice: IInvoice;
  setInvoice: Dispatch<SetStateAction<IInvoice | undefined>>;
}

const InvoiceEditor = ({ invoice, setInvoice }: Props) => {
  const [originalInvoice] = useState(invoice);
  const { updateInvoice, invoiceList } = useContext(InvoiceContext);

  const [currentlyEditing, setCurrentlyEditing] = useState<number>(-1);
  const [isMedicineSelectorOpen, setIsMedicineSelectorOpen] = useState(false);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (setInvoice && invoice) {
        setInvoice({
          ...invoice,
          [ev.target.name]: ev.target.value,
        });
      }
    },
    [invoice]
  );

  const isInvoiceUnique = useMemo(() => {
    if (invoiceList) {
      if (
        originalInvoice.invoiceNumber?.toLowerCase()?.trim() ===
        invoice?.invoiceNumber?.toLowerCase()?.trim()
      ) {
        return false;
      }
      return !invoiceList
        .map((inv) => inv.invoiceNumber)
        .includes(invoice.invoiceNumber.trim());
    }

    return false;
  }, [invoiceList, invoice]);

  const onSubmit = useCallback(async () => {
    if (updateInvoice && invoice) {
      await updateInvoice(invoice);
      setInvoice(undefined);
    }
  }, [invoice]);

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
        Total: (medicine.unitSalePrice * medicine.quantity).toFixed(
          APP_ROUNDOFF_SETTING
        ),
        'Dis %': medicine?.discountPercentage,
        'Adv.Tax': medicine?.advTax,
        'Net Amount': medicine.netAmount?.toFixed(APP_ROUNDOFF_SETTING),
      }));
    } else return [];
  }, [invoice]);

  useEffect(() => {
    setInvoice({
      ...invoice,
      total:
        invoice.InvoiceMedicine?.map(
          (invoiceItem) => invoiceItem.netAmount
        )?.reduce((a, b) => a + b, 0) ?? 0,
    });
  }, [invoice.InvoiceMedicine]);

  return (
    <div>
      <Modal
        isOpen={isMedicineSelectorOpen}
        setIsOpen={setIsMedicineSelectorOpen}
        title="Add New Medicine"
      >
        <InvoiceItemPicker invoiceData={invoice} setInvoiceData={setInvoice} />
      </Modal>
      <Modal
        title="Edit entry"
        isOpen={currentlyEditing !== -1}
        onClosePressed={() => setCurrentlyEditing(-1)}
      >
        <InvoiceItemEditor
          invoiceItem={(invoice.InvoiceMedicine ?? [])?.[currentlyEditing]}
          onUpdate={(updatedItem) => {
            if (invoice?.InvoiceMedicine) {
              const updatedInvoiceItems = invoice.InvoiceMedicine.map(
                (invoiceItem, index) =>
                  index === currentlyEditing ? updatedItem : invoiceItem
              );
              setInvoice({
                ...invoice,
                InvoiceMedicine: updatedInvoiceItems,
              });
            }
            setCurrentlyEditing(-1);
          }}
        />
      </Modal>
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
          <div className="text-3xl font-semibold">{invoice.Supplier?.name}</div>
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
      <Divider className="py-3" />
      <div className="my-4 flex flex-row flex-wrap gap-3">
        <InputField
          name={'invoiceNumber'}
          value={invoice.invoiceNumber}
          onChange={handleChange}
          label="Invoice Number"
          errorText={isInvoiceUnique ? '' : 'Invoice not unique'}
        />
        <InputField
          name={'bookingDriver'}
          value={invoice.bookingDriver ?? ''}
          onChange={handleChange}
          label="Booking Driver"
        />
        <InputField
          name={'Delivered By'}
          value={invoice.deliveredBy ?? ''}
          onChange={handleChange}
          label="Delivered By"
        />
      </div>
      <Table
        data={getFilteredHeader() as unknown as []}
        minHeight="min-h-[40vh]"
        onAddData={() => setIsMedicineSelectorOpen(true)}
        onEdit={(_, index) => {
          if (invoice.InvoiceMedicine && invoice.InvoiceMedicine[index]) {
            setCurrentlyEditing(index);
          }
        }}
        onDelete={(_, index) => {
          if (invoice.InvoiceMedicine && invoice.InvoiceMedicine[index]) {
            setInvoice({
              ...invoice,
              InvoiceMedicine: [
                ...invoice.InvoiceMedicine.filter((_, idx) => idx !== index),
              ],
            });
          }
        }}
      />
      <div className="flex flex-col items-end px-4 pb-4">
        <div className="text-lg text-gray-500">
          <InputField
            label="Advance Tax (adjustment)"
            name="advTax"
            value={sanitizeNaN(String(invoice.advTax) ?? '')}
            onChange={handleChange}
            type="number"
            min={0}
          />
        </div>
        <div className="text-lg text-gray-500 border-b py-2">
          Total: {invoice.total}
        </div>
        <div className="text-lg text-gray-500 pt-3">
          Grand Total:{' '}
          {(
            parseFloat(String(invoice.total)) +
            parseFloat(sanitizeNaN(String(invoice.advTax)))
          ).toFixed(APP_ROUNDOFF_SETTING)}
        </div>
      </div>
      <Divider className="py-4" />
      <div className="gap-3 flex flex-row justify-end">
        <Button onClick={() => setInvoice(undefined)}>Cancel</Button>
        <Button onClick={onSubmit}>Update</Button>
      </div>
    </div>
  );
};

export default InvoiceEditor;
