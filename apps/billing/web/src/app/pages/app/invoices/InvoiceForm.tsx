import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Divider,
  Input,
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
  IInvoice,
  IInvoiceMedicine,
  IMedicine,
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
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import MedicineForm from '../medicines/MedicineForm';
import Table from '../../../shared/organisms/Table';

interface Props {
  formStateSetter?: Dispatch<SetStateAction<boolean>>;
}

const InvoiceForm = ({ formStateSetter }: Props) => {
  const { supplierList } = useContext(SupplierContext);
  const { createInvoice, getInvoices } = useContext(InvoiceContext);
  const { medicineList } = useContext(MedicineContext);

  const [stepCount, setStepCount] = useState(0);

  const [addingNewSupplier, setAddingNewSupplier] = useState(false);
  const [supplierSearchText, setSupplierSearchText] = useState('');

  const [medicineSearchName, setMedicineSearchTaxName] = useState('');
  const [showMedicineCreationForm, setShowMedicineCreationForm] =
    useState(false);
  const [showInvoiceItem, setShowInvoiceItem] = useState(false);

  const [newInvoiceItemBeingEntered, setNewInvoiceItemBeingEntered] =
    useState<IInvoiceMedicine>({
      Medicine: {
        name: '',
        brand: '',
        formula: '',
        type: '',
        code: '',
        packing: '',
        unitTakePrice: 0,
      },
      batchIdentifier: '',
      quantity: 1,
      expirey: new Date(),
      unitSalePrice: 0,
      discountPercentage: 0,
      advTax: 0,
      gst: 0,
      discountedAmount: 0,
      netAmount: 0,
    });

  const [invoiceData, setInvoiceData] = useState<IInvoice>({
    invoiceNumber: '',
    invoiceDate: new Date(),
    bookingDriver: '',
    deliveredBy: '',
    salesTax: 0,
    status: '',
    total: 0,
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

  const getFilteredMedicineList = () => {
    const result = medicineList?.filter((med) =>
      med.name.toLowerCase().includes(medicineSearchName.toLowerCase())
    );
    if (result && result.length) {
      return result;
    }
    return [];
  };

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

  const onClickSaveArticle = useCallback(() => {
    if (invoiceData && invoiceData.InvoiceMedicine) {
      setInvoiceData({
        ...invoiceData,
        InvoiceMedicine: [
          ...invoiceData.InvoiceMedicine,
          newInvoiceItemBeingEntered,
        ],
      });
    }
    setNewInvoiceItemBeingEntered({
      ...newInvoiceItemBeingEntered,
      batchIdentifier: '',
    });
  }, [newInvoiceItemBeingEntered, invoiceData]);

  const calculateNetAmount = () => {
    const salePrice = newInvoiceItemBeingEntered.unitSalePrice || 0;
    const quantity = newInvoiceItemBeingEntered.quantity || 0;
    const discountPerc = newInvoiceItemBeingEntered.discountPercentage || 0;
    const articleUnitGst = newInvoiceItemBeingEntered.gst || 0;
    const advAmount = newInvoiceItemBeingEntered.advTax || 0;

    const netAmount =
      quantity * (salePrice - (salePrice * discountPerc) / 100) +
      (articleUnitGst * quantity || 0) +
      parseFloat(String(advAmount));
    handleChange(
      'netAmount',
      netAmount,
      newInvoiceItemBeingEntered,
      setNewInvoiceItemBeingEntered
    );
  };

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

  const handleChangeOnNewInvoiceItem = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      handleChange(
        ev.target.name,
        ev.target.value,
        newInvoiceItemBeingEntered,
        setNewInvoiceItemBeingEntered
      );
    },
    [newInvoiceItemBeingEntered]
  );

  const deleteInvoiceItem = (rec: IInvoiceMedicine, index: number) => {
    invoiceData.InvoiceMedicine?.splice(index, 1);
    setInvoiceData(invoiceData);
    setShowInvoiceItem(false);
  };

  const handleSubmit = useCallback(async () => {
    if (createInvoice && getInvoices) {
      await createInvoice(invoiceData);
      await getInvoices();
      if (formStateSetter) {
        formStateSetter(false);
      }
    }
  }, [invoiceData]);

  const onSelectInvoiceItem = useCallback(
    (med: IMedicine) => {
      setMedicineSearchTaxName(med.name);
      setNewInvoiceItemBeingEntered({
        ...newInvoiceItemBeingEntered,
        Medicine: {
          ...med,
        },
        unitSalePrice: med.unitTakePrice,
      });
    },
    [medicineSearchName]
  );

  const checkUniqueBatchNumber = useCallback(() => {
    if (!newInvoiceItemBeingEntered.batchIdentifier) {
      return false;
    }
    const existingInvoiceItems = invoiceData.InvoiceMedicine?.map(
      (rec) => rec.batchIdentifier
    );
    if (existingInvoiceItems && existingInvoiceItems.length > 0) {
      return !existingInvoiceItems.includes(
        newInvoiceItemBeingEntered.batchIdentifier
      );
    }
    return true;
  }, [newInvoiceItemBeingEntered]);

  useEffect(calculateNetAmount, [
    newInvoiceItemBeingEntered.unitSalePrice,
    newInvoiceItemBeingEntered.quantity,
    newInvoiceItemBeingEntered.discountPercentage,
    newInvoiceItemBeingEntered.advTax,
    newInvoiceItemBeingEntered.gst,
  ]);

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
                name="invoiceDate"
                value={moment(invoiceData?.invoiceDate).format(APP_TIME_FORMAT)}
                label="Invoice Date"
                type="datetime-local"
                onChange={handleOnChangeInvoice}
                required
              />
              <InputField
                name="salesTax"
                value={invoiceData?.salesTax?.toString() ?? ''}
                label="Sales Tax."
                placeholder="Sales Tax Percentage (%)"
                type="number"
                onChange={handleOnChangeInvoice}
                required
              />
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
            width={'min-w-[100vw]'}
            maxWidth={'min-w-[100vw]'}
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
              minHeight="min-h-[30vh]"
              onDelete={deleteInvoiceItem}
              data={
                invoiceData?.InvoiceMedicine?.map((medicine) => ({
                  Name: medicine.Medicine?.name,
                  Packing: medicine.Medicine?.packing,
                  Batch: medicine.batchIdentifier,
                  Expirey: moment(medicine.expirey).format(APP_TIME_FORMAT),
                  Quantity: medicine.quantity,
                  'Unit Price': medicine.unitSalePrice,
                  'Gross Amt': (
                    medicine.unitSalePrice * medicine.quantity
                  ).toFixed(APP_ROUNDOFF_SETTING),
                  'Dis (%)': medicine?.discountPercentage,
                  'GST (%)': medicine?.gst,
                  'Adv.Tax': medicine?.advTax,
                  'Net Amount':
                    medicine.netAmount?.toFixed(APP_ROUNDOFF_SETTING),
                })) as unknown as []
              }
            />
          </Modal>
          <div className="flex flex-row gap-3">
            <Menu
              positioning={'below-start'}
              button={
                <Input
                  size="large"
                  className="w-full"
                  placeholder="Search Medicine..."
                  value={medicineSearchName}
                  onChange={(e) => setMedicineSearchTaxName(e.target.value)}
                />
              }
            >
              {getFilteredMedicineList()?.map((med) => (
                <div
                  key={med.id}
                  onClick={() => onSelectInvoiceItem(med)}
                  className="cursor-pointer hover:bg-gray-100 p-2 min-w-[150pt] rounded-sm"
                >
                  <div className="text-md">
                    {med?.name} {med?.packing ? `(${med?.packing})` : ''}
                  </div>
                  <div className="text-xs">{med?.type}</div>
                </div>
              ))}
              <div
                onClick={() => setShowMedicineCreationForm(true)}
                className="cursor-pointer hover:bg-gray-100 p-2 min-w-[150pt] rounded-sm"
              >
                <div className="text-md">Add New</div>
              </div>
            </Menu>
            <Input
              size="large"
              placeholder="Batch No."
              name="batchIdentifier"
              onChange={handleChangeOnNewInvoiceItem}
              value={newInvoiceItemBeingEntered.batchIdentifier}
            />
            <Modal
              isOpen={showMedicineCreationForm}
              setIsOpen={setShowMedicineCreationForm}
              onClosePressed={() => setShowMedicineCreationForm(false)}
              triggerButton={
                <Button
                  onClick={() => setShowMedicineCreationForm(true)}
                  size="large"
                >
                  New
                </Button>
              }
            >
              <MedicineForm
                onCreateMedicine={() => setShowMedicineCreationForm(false)}
              />
            </Modal>
          </div>
          <div className="flex flex-row gap-3">
            <InputField
              label="Sale Price"
              placeholder="Enter Sale Price"
              name="unitSalePrice"
              value={String(newInvoiceItemBeingEntered.unitSalePrice)}
              onChange={handleChangeOnNewInvoiceItem}
              type="number"
              min={0}
            />
            <InputField
              label="Disc. %"
              placeholder="Enter Discount %"
              name="discountPercentage"
              value={String(newInvoiceItemBeingEntered.discountPercentage)}
              onChange={handleChangeOnNewInvoiceItem}
              type="number"
              min={0}
            />
          </div>
          <div className="flex flex-row gap-3">
            <InputField
              label="GST Amt."
              placeholder="Enter GST Amount"
              name="gst"
              value={String(newInvoiceItemBeingEntered.gst)}
              onChange={handleChangeOnNewInvoiceItem}
              type="number"
              min={0}
            />
            <InputField
              label="Adv.Tax Amt"
              placeholder="Enter Advance Amount"
              name="advTax"
              value={String(newInvoiceItemBeingEntered.advTax)}
              onChange={handleChangeOnNewInvoiceItem}
              type="number"
              min={0}
            />
            <InputField
              label="Quantity"
              placeholder="Enter Quanitity"
              name="quantity"
              value={String(newInvoiceItemBeingEntered.quantity)}
              onChange={handleChangeOnNewInvoiceItem}
              type="number"
              min={1}
            />
          </div>
          <div className="flex flex-row items-center gap-3 justify-end">
            <div className="bg-blue-100 text-blue-500 p-[7pt] text-md font-semibold px-3 rounded-md">
              Net Amount{' '}
              {sanitizeNaN(
                String(newInvoiceItemBeingEntered.netAmount.toFixed(2))
              )}
            </div>

            <Button
              size="large"
              onClick={onClickSaveArticle}
              disabled={!checkUniqueBatchNumber()}
            >
              Save Article
            </Button>
          </div>
        </div>
      )}
      <Divider className="mb-3 mt-2" />
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="font-semibold text-lg text-gray-500">
          <span>
            Sum total: {invoiceData.total.toFixed(APP_ROUNDOFF_SETTING)}
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
                invoiceData.InvoiceMedicine.length <= 0
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
