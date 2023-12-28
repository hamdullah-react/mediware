import { ISaleInvoice, ISaleInvoiceItem } from '@billinglib';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Button, Spinner } from '@fluentui/react-components';
import InputField from '../../molecules/InputField';
import { SalesContext } from '../../../state/contexts/SalesContext';
import Table from '../Table';
import Modal from '../Modal';
import SaleInvoiceItemPicker from './SaleInvoiceItemPicker';

interface Props {
  invoice: ISaleInvoice;
  setInvoice: Dispatch<SetStateAction<ISaleInvoice | undefined>>;
}
const SalesEditor = ({ invoice, setInvoice }: Props) => {
  const { updateSaleInvoice } = useContext(SalesContext);

  const [showInvoicePicker, setShowInvoicePicker] = useState(false);

  const toggleInvoicePicker = useCallback(
    () => setShowInvoicePicker(!showInvoicePicker),
    [showInvoicePicker]
  );

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setInvoice({
        ...invoice,
        [ev.target.name]: ev.target.value,
      });
    },
    [invoice]
  );

  const onClose = useCallback(() => setInvoice(undefined), [invoice]);

  const onSubmit = useCallback(async () => {
    console.log(invoice);
    if (updateSaleInvoice) {
      await updateSaleInvoice(invoice);
      setInvoice(undefined);
    }
  }, [invoice]);

  const invoiceItems = useMemo(() => {
    if (invoice && invoice?.Items && invoice?.Items.length > 0)
      return invoice.Items.map((item) => ({
        Medicine: `${item.Medicine?.name} (${item.Medicine?.type})`,
        Packing: item.Medicine?.packing,
        Quantity: item.quantity,
        Rate: item.unitSalePrice,
        Total: item.unitSalePrice * item.quantity,
      }));
    return [];
  }, [invoice]);

  const onDeleteInvoiceItem = useCallback(
    (_: unknown, index: number) => {
      console.log(index);
      const invoiceItemsUpdated = invoice.Items;
      invoiceItemsUpdated.splice(index, 1);
      setInvoice({
        ...invoice,
        Items: invoiceItemsUpdated,
      });
    },
    [invoice]
  );

  const onAddItemToInvoice = useCallback(
    (newInvoiceItem: ISaleInvoiceItem) => {
      const updateInvoiceItems = [...invoice.Items, newInvoiceItem];
      setInvoice({
        ...invoice,
        Items: updateInvoiceItems,
      });
    },
    [invoice]
  );

  return invoice ? (
    <div>
      <div className="flex justify-between">
        <table className="flex flex-col gap-1">
          <tbody>
            <tr>
              <InputField
                label="Customer"
                placeholder="Enter customer name"
                name="customerName"
                value={invoice.customerName ?? ''}
                onChange={handleChange}
              />
            </tr>

            <tr>
              <InputField
                label="Telephone"
                placeholder="Enter telephone number"
                name="telephone"
                value={invoice.telephone ?? ''}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <InputField
                label="Whatsapp Contact"
                placeholder="Enter whatsapp number"
                name="whatsapp"
                value={invoice.whatsapp ?? ''}
                onChange={handleChange}
              />
            </tr>
          </tbody>
        </table>
        <table className="flex flex-col gap-1">
          <tbody>
            <tr>
              <InputField
                label="Email"
                placeholder="Enter email address"
                name="email"
                value={invoice.email ?? ''}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <InputField
                label="Address"
                placeholder="Enter customer address"
                name="address"
                value={invoice.address ?? ''}
                onChange={handleChange}
              />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="my-5 text-end">
        <Button appearance="primary" size="small" onClick={toggleInvoicePicker}>
          Add New
        </Button>
      </div>
      <Table
        minHeight="min-h-[30vh]"
        data={invoiceItems}
        onDelete={onDeleteInvoiceItem}
      />
      <Modal
        maxWidth={'80vw'}
        minWidth={'80vw'}
        isOpen={showInvoicePicker}
        onClosePressed={toggleInvoicePicker}
      >
        <SaleInvoiceItemPicker
          invoiceItems={invoice.Items}
          onAddItem={onAddItemToInvoice}
          onCloseForm={toggleInvoicePicker}
          onSaveItems={toggleInvoicePicker}
          onDeleteItem={(index) => onDeleteInvoiceItem({}, index)}
        />
      </Modal>

      <div className="flex flex-row justify-end gap-3">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} appearance="primary">
          Update
        </Button>
      </div>
    </div>
  ) : (
    <div className="p-6">
      <Spinner label={'Loading'} labelPosition="below" />
    </div>
  );
};

export default SalesEditor;
