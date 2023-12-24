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
import {
  Button,
  Divider,
  MenuItem,
  Popover,
  PopoverSurface,
  PopoverTrigger,
} from '@fluentui/react-components';
import ListSelectors from '../../../shared/organisms/ListSelectors';
import { SupplierContext } from '../../../state/contexts/SupplierContext';
import {
  APP_ROUNDOFF_SETTING,
  APP_TIME_FORMAT,
  APP_UI_FORM_TIME_FORMAT,
  IInvoice,
  IInvoiceMedicine,
  ISupplier,
} from '@billinglib';
import clsx from 'clsx';
import Modal from '../../../shared/organisms/Modal';
import SupplierForm from '../suppliers/SupplierForm';
import InputField from '../../../shared/molecules/InputField';
import { handleChange, sanitizeNaN } from '../../../utils/common';
import Menu from '../../../shared/organisms/Menu';
import { STATAUS } from '../../../utils/types';
import moment from 'moment';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';
import Table from '../../../shared/organisms/Table';
import InvoiceItemPicker from '../../../shared/organisms/invoice/InvoiceItemPicker';

interface Props {
  formStateSetter?: Dispatch<SetStateAction<boolean>>;
}

const InvoiceForm = ({ formStateSetter }: Props) => {
  const { supplierList } = useContext(SupplierContext);
  const { createInvoice, getInvoices, invoiceList } =
    useContext(InvoiceContext);

  const [stepCount, setStepCount] = useState(0);

  const [addingNewSupplier, setAddingNewSupplier] = useState(false);
  const [supplierSearchText, setSupplierSearchText] = useState('');

  const [showInvoiceItem, setShowInvoiceItem] = useState(false);

  const [invoiceData, setInvoiceData] = useState<IInvoice>({
    invoiceNumber: '',
    invoiceDate: new Date(),
    bookingDriver: '',
    deliveredBy: '',
    salesTax: 0,
    status: '',
    total: 0,
    advTax: 0,
    InvoiceMedicine: [],
  });

  const onSelectSupplier = useCallback(
    (selectedSupplier: ISupplier) => {
      setInvoiceData({
        ...invoiceData,
        supplierId: selectedSupplier?.id,
        Supplier: selectedSupplier,
      });
    },
    [invoiceData]
  );

  const toggleAddNewSupplier = useCallback(
    () => setAddingNewSupplier(!addingNewSupplier),
    [addingNewSupplier]
  );

  const getFilteredListOfSuppliers = useCallback(() => {
    return (
      supplierList?.filter(
        (supplier) =>
          supplier.name
            .toLocaleLowerCase()
            .includes(supplierSearchText.toLocaleLowerCase()) ||
          supplier.emails
            .toLocaleLowerCase()
            .includes(supplierSearchText.toLocaleLowerCase()) ||
          supplier.telephones
            .toLocaleLowerCase()
            .includes(supplierSearchText.toLocaleLowerCase())
      ) ?? []
    );
  }, [supplierList, supplierSearchText]);

  useEffect(() => {
    const netAmounts = invoiceData.InvoiceMedicine?.map(
      (invoiceItem) => invoiceItem.netAmount
    );
    if (netAmounts && netAmounts.length > 0) {
      setInvoiceData({
        ...invoiceData,
        total: (netAmounts ?? [0])?.reduce((a, b) => a + b, 0),
      });
    }
  }, [invoiceData.InvoiceMedicine]);

  const handleOnChangeInvoice = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      handleChange(
        ev.target.name,
        ev.target.value,
        invoiceData,
        setInvoiceData
      );
    },
    [invoiceData]
  );

  const deleteInvoiceItem = (rec: IInvoiceMedicine, index: number) => {
    invoiceData.InvoiceMedicine?.splice(index, 1);
    setInvoiceData(invoiceData);
    setShowInvoiceItem(false);
  };

  const isInvoiceUnique = useMemo(() => {
    if (invoiceList) {
      return !invoiceList
        .map((inv) => inv.invoiceNumber)
        .includes(invoiceData.invoiceNumber.trim());
    }

    return false;
  }, [invoiceList, invoiceData]);

  const handleSubmit = useCallback(async () => {
    if (createInvoice && getInvoices) {
      await createInvoice(invoiceData);
      await getInvoices();
      if (formStateSetter) {
        formStateSetter(false);
      }
    }
  }, [invoiceData]);

  return (
    <div className="gap-2 flex flex-col">
      {stepCount === 0 && supplierList && (
        <>
          <Modal
            isOpen={addingNewSupplier}
            hideClose={false}
            modalType="modal"
            setIsOpen={setAddingNewSupplier}
            title="Add Supplier"
          >
            <SupplierForm onCreateSupplier={toggleAddNewSupplier} />
          </Modal>
          <ListSelectors
            list={getFilteredListOfSuppliers()}
            listTitle="Select Supplier"
            searchQuery={supplierSearchText}
            setSearchQuery={setSupplierSearchText}
            addNewEntry={toggleAddNewSupplier}
            renderItem={(supplier, index) => (
              <div
                key={index}
                className={clsx([
                  'p-2 border rounded-md cursor-pointer',
                  'hover:shadow-md',
                  invoiceData?.supplierId === supplier?.id
                    ? 'bg-blue-500 text-white'
                    : 'text-black',
                  'transition-all duration-200',
                ])}
                onClick={() => onSelectSupplier(supplier)}
              >
                <div className="text-lg">{supplier.name}</div>
                <div className="text-xs">{supplier.emails}</div>
              </div>
            )}
          />
        </>
      )}
      {stepCount === 1 && invoiceData && invoiceData?.Supplier && (
        <div>
          <Popover positioning={'below-start'}>
            <PopoverTrigger>
              <Button>Invoicing Supplier {invoiceData?.Supplier?.name}</Button>
            </PopoverTrigger>
            <PopoverSurface>
              <div className="text-lg capitalize">
                Name: {invoiceData?.Supplier?.name}
              </div>
              <div className="text-xs">
                Emails: {invoiceData?.Supplier?.emails}
              </div>
              <div className="text-xs">
                Telephones: {invoiceData?.Supplier?.telephones}
              </div>
              <div className="mt-3">{'Calculating payables...'}</div>
            </PopoverSurface>
          </Popover>
          <div className="my-3 flex-col gap-2 flex align-bottom">
            <div className="flex flex-row gap-3">
              <div className="flex-1">
                <InputField
                  name="invoiceNumber"
                  value={invoiceData?.invoiceNumber}
                  label="Invoice Number"
                  placeholder="Enter invoice number"
                  onChange={handleOnChangeInvoice}
                  required
                  errorText={isInvoiceUnique ? '' : 'Invoice number not unique'}
                />
              </div>
              <div className="flex-col flex justify-end">
                <Menu
                  button={
                    <Button size="large">
                      {invoiceData?.status ? invoiceData?.status : 'Status'}
                    </Button>
                  }
                >
                  {STATAUS.map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() =>
                        handleChange(
                          'status',
                          status,
                          invoiceData,
                          setInvoiceData
                        )
                      }
                    >
                      {status}
                    </MenuItem>
                  ))}
                  <Divider className="my-2" />
                  <MenuItem
                    onClick={() =>
                      handleChange('status', '', invoiceData, setInvoiceData)
                    }
                  >
                    Clear
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <InputField
                name="deliveredBy"
                value={invoiceData?.deliveredBy ?? ''}
                label="Delivered By"
                placeholder="Delivered By"
                onChange={handleOnChangeInvoice}
              />
              <InputField
                name="bookingDriver"
                value={invoiceData?.bookingDriver ?? ''}
                label="Booking Driver"
                placeholder="Booking driver name"
                onChange={handleOnChangeInvoice}
              />
              <InputField
                name="invoiceDate"
                value={moment(invoiceData?.invoiceDate).format(
                  APP_UI_FORM_TIME_FORMAT
                )}
                label="Invoice Date"
                type="datetime-local"
                onChange={handleOnChangeInvoice}
                required
              />
            </div>

            <div className="flex justify-end mt-3">
              <Button onClick={() => setStepCount(stepCount + 1)}>
                Add Medicines
              </Button>
            </div>
          </div>
        </div>
      )}
      {stepCount === 2 && (
        <div className="flex flex-col gap-3">
          <Divider />
          <Modal
            width={'80vw'}
            maxWidth={'80vw'}
            minWidth={'80vw'}
            isOpen={showInvoiceItem}
            setIsOpen={setShowInvoiceItem}
            title="Enter New Medicine"
            triggerButton={
              <Button
                size="small"
                appearance="subtle"
                onClick={() => setShowInvoiceItem(!showInvoiceItem)}
              >
                Show Items ({invoiceData.InvoiceMedicine?.length})
              </Button>
            }
          >
            <Table
              minHeight="min-h-[40vh]"
              onDelete={deleteInvoiceItem}
              data={
                invoiceData?.InvoiceMedicine?.map((medicine) => ({
                  Name: medicine.Medicine?.name,
                  Packing: medicine.Medicine?.packing,
                  Batch: medicine.batchIdentifier,
                  Expirey: moment(medicine.expirey).format(APP_TIME_FORMAT),
                  Quantity: medicine.quantity,
                  'Unit Price': medicine.unitSalePrice,
                  Total: (medicine.unitSalePrice * medicine.quantity).toFixed(
                    APP_ROUNDOFF_SETTING
                  ),
                  'Dis (%)': medicine?.discountPercentage,
                  'GST (%)': medicine?.gst,
                  'Adv.Tax': medicine?.advTax,
                  'Net Amount':
                    medicine.netAmount?.toFixed(APP_ROUNDOFF_SETTING),
                })) as unknown as []
              }
            />
          </Modal>
          <InvoiceItemPicker
            invoiceData={invoiceData}
            setInvoiceData={
              setInvoiceData as Dispatch<SetStateAction<IInvoice | undefined>>
            }
          />
          <Divider />
          <div className="flex flex-row items-end justify-end">
            <div className="flex-1 text-end py-2.5">Advance Tax (if any)</div>
            <InputField
              name="advTax"
              onChange={handleOnChangeInvoice}
              value={String(invoiceData.advTax)}
              type="number"
              placeholder="Advance Tax (if any)"
              className="ml-5"
              min={0}
            />
          </div>
        </div>
      )}
      <Divider className="mb-3 mt-2" />
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="font-semibold text-lg text-gray-500">
          <span>
            Sum total:{' '}
            {(
              parseFloat(String(invoiceData.total)) +
              parseFloat(String(sanitizeNaN(String(invoiceData.advTax))))
            ).toFixed(APP_ROUNDOFF_SETTING)}
          </span>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button
            size="large"
            disabled={stepCount <= 0}
            onClick={() => setStepCount(stepCount - 1)}
          >
            Previouse
          </Button>
          {stepCount < 2 ? (
            <Button
              size="large"
              disabled={stepCount >= 2 || !invoiceData?.Supplier}
              onClick={() => setStepCount(stepCount + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="large"
              appearance="primary"
              disabled={
                invoiceData &&
                !!invoiceData.InvoiceMedicine &&
                invoiceData.InvoiceMedicine.length <= 0 &&
                (!isInvoiceUnique || !invoiceData.invoiceNumber)
              }
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
