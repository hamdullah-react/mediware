import { IMedicine, ISaleInvoice, ISaleInvoiceItem } from '@billinglib';
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
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import { sanitizeNaN } from '../../../utils/common';
import clsx from 'clsx';

interface Props {
  invoice: ISaleInvoice;
  setInvoice: Dispatch<SetStateAction<ISaleInvoice | undefined>>;
}
const SalesEditor = ({ invoice, setInvoice }: Props) => {
  const { updateSaleInvoice } = useContext(SalesContext);
  const [showInvoicePicker, setShowInvoicePicker] = useState(false);
  const { medicineList, setMedicineList } = useContext(MedicineContext);
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
      const invoiceItemsUpdated = invoice.Items;

      if (medicineList && setMedicineList) {
        setMedicineList(
          medicineList.map((med) =>
            med.id === invoiceItemsUpdated[index].Medicine?.id
              ? ({
                  ...med,
                  quantityInStock:
                    (med?.quantityInStock ?? 0) +
                    invoiceItemsUpdated[index].quantity,
                } as IMedicine)
              : med
          )
        );
      }

      invoiceItemsUpdated.splice(index, 1);
      setInvoice({
        ...invoice,
        Items: invoiceItemsUpdated,
      });
    },
    [invoice, medicineList]
  );

  const onAddItemToInvoice = useCallback(
    (newInvoiceItem: ISaleInvoiceItem) => {
      const updateInvoiceItems = [...invoice.Items, newInvoiceItem];
      if (medicineList && setMedicineList) {
        setMedicineList(
          medicineList.map((med) =>
            med.id === newInvoiceItem.Medicine?.id
              ? ({
                  ...med,
                  quantityInStock:
                    (med?.quantityInStock ?? 0) - newInvoiceItem.quantity,
                } as IMedicine)
              : med
          )
        );
      }

      setInvoice({
        ...invoice,
        Items: updateInvoiceItems,
      });
    },
    [invoice, medicineList]
  );

  const invoiceItemsTotal = useMemo(() => {
    return invoice?.Items?.map(
      (med) => (med.quantity || 1) * (med.unitSalePrice || 0)
    ).reduce((a, b) => a + b, 0);
  }, [invoice]);

  const invoiceBalance = useMemo(() => {
    return (
      invoiceItemsTotal -
      parseFloat(String(sanitizeNaN(String(invoice.dicountPrice)))) -
      parseFloat(String(sanitizeNaN(String(invoice.totalRecieved))))
    );
  }, [invoice]);

  return invoice ? (
    <div>
      <div className="grid grid-flow-row grid-cols-3 gap-3">
        <InputField
          label="Customer"
          placeholder="Enter customer name"
          name="customerName"
          value={invoice.customerName ?? ''}
          onChange={handleChange}
        />
        <InputField
          label="Telephone"
          placeholder="Enter telephone number"
          name="telephone"
          value={invoice.telephone ?? ''}
          onChange={handleChange}
        />
        <InputField
          label="Whatsapp Contact"
          placeholder="Enter whatsapp number"
          name="whatsapp"
          value={invoice.whatsapp ?? ''}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          placeholder="Enter email address"
          name="email"
          value={invoice.email ?? ''}
          onChange={handleChange}
        />
        <InputField
          label="Address"
          placeholder="Enter customer address"
          name="address"
          value={invoice.address ?? ''}
          onChange={handleChange}
        />
      </div>
      <div className="my-5 text-end">
        <Button appearance="primary" size="small" onClick={toggleInvoicePicker}>
          Add New
        </Button>
      </div>
      <Table
        minHeight="min-h-[20vh]"
        data={invoiceItems}
        onDelete={onDeleteInvoiceItem}
      />
      <div className="my-4 py-4 border-b flex flex-row gap-3 items-center">
        <div>
          <InputField
            name="dicountPrice"
            value={sanitizeNaN(String(invoice.dicountPrice))}
            onChange={handleChange}
            label="Discount Price"
            type="number"
          />
        </div>
        <div>
          <InputField
            name="totalRecieved"
            value={sanitizeNaN(String(invoice.totalRecieved))}
            onChange={handleChange}
            label="Recieved Amount"
            type="number"
          />
        </div>
      </div>
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
          isEdititng
        />
      </Modal>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-start items-center gap-3">
          <div
            className={clsx([
              'bg-yellow-300 text-yellow-800 font-bold p-2 px-3 rounded-md',
            ])}
          >
            Total: {invoiceItemsTotal}
          </div>
          <div
            className={clsx([
              'p-2 px-3 rounded-md font-bold transition-none duration-500',
              invoiceBalance <= 0
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800',
            ])}
          >
            Balance: {invoiceBalance}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} appearance="primary">
            Update
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="p-6">
      <Spinner label={'Loading'} labelPosition="below" />
    </div>
  );
};

export default SalesEditor;
