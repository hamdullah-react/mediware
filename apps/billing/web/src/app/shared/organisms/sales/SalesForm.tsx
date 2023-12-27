import { ISaleInvoice, ISaleInvoiceItem } from '@billinglib';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import InputField from '../../molecules/InputField';
import { Button, Divider } from '@fluentui/react-components';
import Modal from '../Modal';
import SaleInvoiceItemPicker from './SaleInvoiceItemPicker';
import { sanitizeNaN } from '../../../utils/common';
import clsx from 'clsx';
import { SalesContext } from '../../../state/contexts/SalesContext';

interface Props {
  onCreateSupplier?: () => void;
  formStateSetter?: Dispatch<SetStateAction<boolean>>;
}

const SalesForm = ({ formStateSetter, onCreateSupplier }: Props) => {
  const { saleInvoiceList, createSaleInvoice } = useContext(SalesContext);
  const [showInvoiceItemPicker, setShowInvoiceItemPicker] = useState(false);
  const [newSaleInvoice, setNewSaleInvoice] = useState<ISaleInvoice>({
    customerName: '',
    saleInvoiceId: '',
    dicountPrice: 0,
    totalRecieved: 0,
    address: '',
    telephone: '',
    email: '',
    whatsapp: '',
    Items: [],
  });

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setNewSaleInvoice({
        ...newSaleInvoice,
        [ev.target.name]: ev.target.value,
      });
    },
    [newSaleInvoice]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (createSaleInvoice) {
        await createSaleInvoice(newSaleInvoice);
        if (formStateSetter) formStateSetter(false);
        if (onCreateSupplier) onCreateSupplier();
        setNewSaleInvoice({
          saleInvoiceId: '',
          customerName: '',
          address: '',
          email: '',
          telephone: '',
          whatsapp: '',
          dicountPrice: 0,
          totalRecieved: 0,
          Items: [],
        });
      }
    },
    [newSaleInvoice]
  );

  const toggleInvoiceItemPicker = useCallback(
    () => setShowInvoiceItemPicker(!showInvoiceItemPicker),
    [showInvoiceItemPicker]
  );

  const onAddItemToInvoice = useCallback(
    (data: ISaleInvoiceItem) => {
      setNewSaleInvoice({
        ...newSaleInvoice,
        Items: [...newSaleInvoice.Items, data],
      });
    },
    [newSaleInvoice]
  );

  const invoiceItemsTotal = useMemo(() => {
    return newSaleInvoice?.Items?.map(
      (med) => (med.quantity || 1) * (med.unitSalePrice || 0)
    ).reduce((a, b) => a + b, 0);
  }, [newSaleInvoice]);

  const invoiceBalance = useMemo(() => {
    return (
      invoiceItemsTotal -
      parseFloat(String(sanitizeNaN(String(newSaleInvoice.dicountPrice)))) -
      parseFloat(String(sanitizeNaN(String(newSaleInvoice.totalRecieved))))
    );
  }, [newSaleInvoice]);

  const onDeleteItemFromInvoice = useCallback(
    (index: number) => {
      const updatedList = newSaleInvoice.Items;
      if (updatedList.length > 0) {
        updatedList.splice(index, 1);
      }

      setNewSaleInvoice({
        ...newSaleInvoice,
        Items: updatedList,
      });
    },
    [newSaleInvoice]
  );

  const uniqueInvoiceIdError = useMemo(() => {
    if (saleInvoiceList) {
      return saleInvoiceList?.findIndex(
        (invoice) =>
          invoice.saleInvoiceId?.toLowerCase() ===
          newSaleInvoice?.saleInvoiceId?.toLowerCase()
      ) !== -1
        ? 'Invoice exists'
        : '';
    }
    return '';
  }, [saleInvoiceList, newSaleInvoice]);

  const onSaveInvoiceItems = useCallback(() => {
    toggleInvoiceItemPicker();
  }, [newSaleInvoice]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-flow-row grid-cols-3 gap-3">
        <InputField
          name="saleInvoiceId"
          value={newSaleInvoice.saleInvoiceId}
          onChange={handleChange}
          label="Invoice ID"
          placeholder="Enter Invoice ID"
          type="text"
          errorText={uniqueInvoiceIdError}
          required
        />
        <InputField
          name="customerName"
          value={newSaleInvoice.customerName}
          onChange={handleChange}
          label="Customer"
          placeholder="Enter Customer Name"
          type="text"
          required
        />
        <InputField
          name="email"
          value={newSaleInvoice.email ?? ''}
          onChange={handleChange}
          label="Email"
          placeholder="Enter Email - optional"
          type="email"
        />
        <InputField
          name="telephone"
          value={newSaleInvoice.telephone ?? ''}
          onChange={handleChange}
          label="Telephone"
          placeholder="Enter telephone - optional"
          type="tel"
        />
        <InputField
          name="whatsapp"
          value={newSaleInvoice.whatsapp ?? ''}
          onChange={handleChange}
          label="Whatsapp"
          placeholder="Enter Whatsapp - optional"
          type="tel"
        />
        <InputField
          name="address"
          value={newSaleInvoice.address ?? ''}
          onChange={handleChange}
          label="Address"
          placeholder="Enter Address - optional"
          type="text"
        />
      </div>
      <div className="pt-5 pb-2">Total Price: {invoiceItemsTotal}</div>
      <div className="grid grid-cols-4 gap-3">
        <InputField
          name="dicountPrice"
          value={sanitizeNaN(String(newSaleInvoice.dicountPrice)) ?? ''}
          onChange={handleChange}
          label="Discounted Price"
          min={0}
          type="number"
        />
        <InputField
          name="totalRecieved"
          value={sanitizeNaN(String(newSaleInvoice.totalRecieved)) ?? ''}
          onChange={handleChange}
          label="Received"
          min={0}
          type="number"
        />
        <div
          className={clsx([
            'h-full px-4 py-2 font-semibold rounded-md',
            'transition-all duration-500',
            'flex items-center justify-center',
            'bg-green-200 text-green-700',
          ])}
        >
          Total{' '}
          {invoiceItemsTotal -
            parseFloat(
              String(sanitizeNaN(String(newSaleInvoice.dicountPrice)))
            )}
        </div>
        <div
          className={clsx([
            'h-full px-4 py-2 font-semibold rounded-md',
            'flex items-center justify-center',
            'transition-all duration-500',
            invoiceBalance <= 0
              ? 'bg-green-200 text-green-700'
              : 'bg-red-200 text-red-700',
          ])}
        >
          Balance {invoiceBalance}
        </div>
      </div>
      <Divider className="my-3" />
      <div className="flex flex-row justify-end gap-3">
        <Modal
          isOpen={showInvoiceItemPicker}
          width={'80vw'}
          maxWidth={'80vw'}
          title={`Add Items to invoice #${newSaleInvoice.saleInvoiceId}`}
          onClosePressed={toggleInvoiceItemPicker}
          triggerButton={
            <Button
              disabled={
                !newSaleInvoice.customerName ||
                !newSaleInvoice.saleInvoiceId ||
                !!uniqueInvoiceIdError
              }
              size="large"
              onClick={toggleInvoiceItemPicker}
            >
              Invoice Items
            </Button>
          }
        >
          <SaleInvoiceItemPicker
            invoiceItems={newSaleInvoice.Items}
            onAddItem={onAddItemToInvoice}
            onDeleteItem={onDeleteItemFromInvoice}
            onSaveItems={onSaveInvoiceItems}
            onCloseForm={toggleInvoiceItemPicker}
          />
        </Modal>
        <Button
          disabled={
            !newSaleInvoice.customerName ||
            !newSaleInvoice.saleInvoiceId ||
            !newSaleInvoice?.Items ||
            newSaleInvoice?.Items?.length <= 0 ||
            !!uniqueInvoiceIdError
          }
          size="large"
          type="submit"
          appearance="primary"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;
