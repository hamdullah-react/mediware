import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Divider,
  MenuItem,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
} from '@fluentui/react-components';
import ListSelectors from '../../../shared/organisms/ListSelectors';
import { SupplierContext } from '../../../state/contexts/SupplierContext';
import {
  APP_ROUNDOFF_SETTING,
  IInvoice,
  IInvoiceMedicine,
  ISupplier,
  MedicineTypes,
} from '@billinglib';
import clsx from 'clsx';
import Modal from '../../../shared/organisms/Modal';
import SupplierForm from '../suppliers/SupplierForm';
import InputField from '../../../shared/molecules/InputField';
import {
  getFormElementValue,
  handleChange,
  sanitizeNaN,
} from '../../../utils/common';
import Menu from '../../../shared/organisms/Menu';
import { STATAUS } from '../../../utils/types';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import moment from 'moment';
import Table from '../../../shared/organisms/Table';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';

const InvoiceForm = () => {
  const { supplierList } = useContext(SupplierContext);
  const { medicineList } = useContext(MedicineContext);
  const { createInvoice, getInvoices } = useContext(InvoiceContext);

  const [stepCount, setStepCount] = useState(0);
  const [showInvoiceItems, setShowInvoiceItems] = useState(false);
  // const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(0);

  const [addingNewSupplier, setAddingNewSupplier] = useState(false);
  const [supplierSearchText, setSupplierSearchText] = useState('');

  const [medicineSearchText, setMedicineSearchText] = useState('');
  const [showMedicineListPopover, setShowMedicineListPopover] = useState(false);
  const [newInvoiceItemBeingEntered, setNewInvoiceItemBeingEntered] =
    useState<IInvoiceMedicine>({
      Medicine: { name: '', brand: '', formula: '', type: '', code: '' },
      batchIdentifier: '',
      quantity: 0,
      packing: '',
      expirey: new Date(),
      unitTakePrice: 0,
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

  const getFilteredListOfMedicines = useCallback(() => {
    return (
      medicineList?.filter(
        (medicine) =>
          medicine.name
            .toLocaleLowerCase()
            .includes(medicineSearchText.toLocaleLowerCase()) ||
          medicine?.formula
            ?.toLocaleLowerCase()
            .includes(medicineSearchText.toLocaleLowerCase()) ||
          medicine?.brand
            ?.toLocaleLowerCase()
            .includes(medicineSearchText.toLocaleLowerCase()) ||
          medicine?.type
            ?.toLocaleLowerCase()
            .includes(medicineSearchText.toLocaleLowerCase())
      ) ?? []
    );
  }, [medicineList, medicineSearchText]);

  const calculateInvoiceTotal = useCallback(() => {
    const netAmounts = invoiceData.InvoiceMedicine?.map(
      (invoiceItem) => invoiceItem.netAmount
    );
    if (netAmounts && netAmounts?.length > 0) {
      const sum = (netAmounts ?? [0, 0, 0]).reduce((a, b) => a + b);
      setInvoiceData({
        ...invoiceData,
        total: sum,
      });
    } else {
      setInvoiceData({
        ...invoiceData,
        total: 0,
      });
    }
  }, [invoiceData]);

  const addNewItemOnInvoice = useCallback(() => {
    setInvoiceData({
      ...invoiceData,
      InvoiceMedicine: [
        ...(invoiceData.InvoiceMedicine ?? []),
        newInvoiceItemBeingEntered,
      ],
    });
    setMedicineSearchText('');
    setNewInvoiceItemBeingEntered({
      Medicine: { name: '', brand: '', formula: '', type: '', code: '' },
      batchIdentifier: '',
      quantity: 0,
      packing: '',
      expirey: new Date(),
      unitTakePrice: 0,
      unitSalePrice: 0,
      gst: 0,
      discountPercentage: 0,
      advTax: 0,
      discountedAmount: 0,
      netAmount: 0,
    });
  }, [invoiceData, newInvoiceItemBeingEntered]);

  const hydrateFormWithPreviousInvoiceItem = useCallback(() => {
    // TODO: show previous invoice item
  }, []);

  const hydrateFormWithNextInvoiceItem = useCallback(() => {
    // TODO: show next invoice item
  }, []);

  const getValueOfForm = useCallback(
    (queryKey: string) => {
      const atIndex = Object.keys(newInvoiceItemBeingEntered).findIndex(
        (key) => key === queryKey
      );

      return Object.values(newInvoiceItemBeingEntered)?.at(atIndex);
    },
    [newInvoiceItemBeingEntered]
  );

  const toggleShowInvoiceItems = useCallback(() => {
    setShowInvoiceItems(!showInvoiceItems);
  }, [showInvoiceItems]);

  const calculateNetAmount = useCallback(() => {
    const discountAmount = getFormElementValue('discountAmount');

    if (
      discountAmount !== undefined &&
      newInvoiceItemBeingEntered.advTax !== undefined
    ) {
      const netAmountWithoutTax =
        (parseFloat(getValueOfForm('unitSalePrice')) -
          parseFloat(sanitizeNaN(discountAmount)) +
          (parseFloat(
            sanitizeNaN((newInvoiceItemBeingEntered.gst ?? 0)?.toString())
          ) /
            100) *
            parseFloat(getValueOfForm('unitSalePrice'))) *
        parseFloat(newInvoiceItemBeingEntered?.quantity.toString());

      const netAmount =
        parseFloat(sanitizeNaN(netAmountWithoutTax.toString())) +
        parseFloat(
          newInvoiceItemBeingEntered.advTax
            ? newInvoiceItemBeingEntered.advTax.toString()
            : '0'
        );

      handleChange(
        'netAmount',
        netAmount,
        newInvoiceItemBeingEntered,
        setNewInvoiceItemBeingEntered
      );
    }
    calculateInvoiceTotal();
  }, [getValueOfForm, newInvoiceItemBeingEntered]);

  const handleOnChangeCurrentInvoiceItem = useCallback(
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

  const handleSubmit = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (createInvoice && getInvoices) {
        await createInvoice(invoiceData);
        await getInvoices();
      }
    },
    [invoiceData]
  );

  useEffect(calculateNetAmount, [
    newInvoiceItemBeingEntered.unitSalePrice,
    newInvoiceItemBeingEntered.quantity,
    newInvoiceItemBeingEntered.discountPercentage,
    newInvoiceItemBeingEntered.advTax,
    newInvoiceItemBeingEntered.gst,
  ]);

  return (
    <form className="gap-2 flex flex-col" onSubmit={handleSubmit}>
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
            <InputField
              name="invoiceDate"
              value={moment(invoiceData?.invoiceDate).format(
                'yyyy-MM-DDTHH:mm'
              )}
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

            <div className="flex justify-end mt-3">
              <Button onClick={() => setStepCount(stepCount + 1)}>
                Add Medicines
              </Button>
            </div>
          </div>
        </div>
      )}
      {stepCount === 2 && (
        <div>
          <div className="my-2 py-2 border-b text-bold text-md text-gray-400 flex flex-row justify-between">
            <div>Batch Information</div>

            <Modal
              maxWidth={'90vw'}
              title={`Invoice #${invoiceData?.invoiceNumber}`}
              triggerButton={
                <Button
                  size="small"
                  disabled={!invoiceData?.InvoiceMedicine?.length ?? true}
                  onClick={toggleShowInvoiceItems}
                >
                  Items ({invoiceData?.InvoiceMedicine?.length})
                </Button>
              }
              isOpen={showInvoiceItems}
              setIsOpen={setShowInvoiceItems}
            >
              {invoiceData?.InvoiceMedicine && (
                <Table
                  minHeight="min-h-[30vh]"
                  onDelete={(_, index) => {
                    if (
                      invoiceData.InvoiceMedicine &&
                      invoiceData.InvoiceMedicine.length > 0
                    ) {
                      // invoiceData.InvoiceMedicine.splice(index, 1);
                      setInvoiceData(invoiceData);
                    }
                  }}
                  data={invoiceData?.InvoiceMedicine?.map((medicine) => ({
                    Name: medicine.Medicine?.name,
                    Packing: medicine.packing,
                    Batch: medicine.batchIdentifier,
                    Expirey: moment(medicine.expirey).format('DD/MM/YYYY'),
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
                  }))}
                />
              )}
            </Modal>
          </div>
          <div className="relative">
            <InputField
              name="medicineSearchText"
              label="Search Medicine"
              value={medicineSearchText}
              onChange={(e) => setMedicineSearchText(e.target.value)}
              placeholder="Search Medicine"
              onFocus={() => setShowMedicineListPopover(true)}
              onBlur={() => setShowMedicineListPopover(false)}
              fieldSize="medium"
            />
            {showMedicineListPopover && (
              <div
                className={clsx([
                  'bg-white z-20 flex flex-col mt-2 absolute border',
                  'min-w-[180pt] shadow-md rounded-md cursor-pointer',
                ])}
              >
                {getFilteredListOfMedicines()?.map((medicine) => (
                  <div
                    key={medicine.id}
                    onMouseDown={() => {
                      setMedicineSearchText(medicine?.name);
                      setNewInvoiceItemBeingEntered({
                        ...newInvoiceItemBeingEntered,
                        medicineId: medicine?.id,
                        Medicine: {
                          ...medicine,
                          name: medicine.name,
                        },
                      });
                    }}
                    className="p-2 rounded-sm hover:bg-gray-100"
                  >
                    <div className="text-xs">{medicine.brand}</div>
                    <div className="text-md">{medicine.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <InputField
                  name="batchIdentifier"
                  value={newInvoiceItemBeingEntered?.batchIdentifier ?? ''}
                  placeholder="Enter batch code / identifier"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Batch Identifier"
                />
                <InputField
                  name="quantity"
                  value={newInvoiceItemBeingEntered?.quantity.toString()}
                  placeholder="Quantity recieved"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Medicine Quantity"
                  type="number"
                />
              </div>
              <div className="flex flex-row gap-2">
                <InputField
                  name="packing"
                  value={newInvoiceItemBeingEntered?.packing ?? ''}
                  placeholder="10mg, 10x10 ..."
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Packing type"
                />
                <InputField
                  name="expirey"
                  value={moment(newInvoiceItemBeingEntered?.expirey).format(
                    'yyy-MM-DD'
                  )}
                  placeholder="Medicine Expirey"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Expirey Date"
                  type="date"
                />
              </div>
              <div className="flex flex-row gap-2">
                <InputField
                  name="unitTakePrice"
                  value={newInvoiceItemBeingEntered?.unitTakePrice.toString()}
                  placeholder="Enter Unit Price"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Unit take price"
                  type="number"
                />
                <InputField
                  name="unitSalePrice"
                  value={newInvoiceItemBeingEntered?.unitSalePrice.toString()}
                  placeholder="Medicine sale price"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Sale price"
                  type="number"
                />
              </div>
              <div className="flex flex-row gap-2">
                <InputField
                  name="discountPercentage"
                  value={newInvoiceItemBeingEntered?.discountPercentage.toString()}
                  placeholder="Discount (%)"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Discount Percentage (%)"
                  type="number"
                  max={100}
                  min={0}
                />
                <InputField
                  disabled
                  name="discountAmount"
                  value={(
                    newInvoiceItemBeingEntered?.unitSalePrice *
                    (newInvoiceItemBeingEntered?.discountPercentage / 100)
                  ).toFixed(APP_ROUNDOFF_SETTING)}
                  placeholder="Medicine Brand"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="Discount"
                  type="number"
                />
              </div>
              <div className="flex flex-row gap-2">
                <InputField
                  name="advTax"
                  value={newInvoiceItemBeingEntered?.advTax.toString()}
                  placeholder="Adv.Tax"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  type="number"
                  label="Adv Tax "
                />

                <InputField
                  name="gst"
                  value={newInvoiceItemBeingEntered?.gst?.toString() ?? ''}
                  placeholder="GST (%)"
                  onChange={handleOnChangeCurrentInvoiceItem}
                  label="GST (%)"
                  type="number"
                  min={0}
                  max={100}
                />
              </div>
              <div className="flex flex-row gap-2 my-4">
                <div className="flex-1 text-center items-center flex justify-center font-semibold text-lg bg-blue-100 rounded-sm text-blue-600">
                  Net Amount
                </div>
                <InputField
                  disabled
                  name="grossAmount"
                  value={newInvoiceItemBeingEntered?.netAmount.toFixed(
                    APP_ROUNDOFF_SETTING
                  )}
                  placeholder="Gross Amount"
                  onChange={handleOnChangeInvoice}
                  type="number"
                />
              </div>

              <Divider className="mb-3 mt-3" />

              <div className="flex flex-row gap-2">
                <InputField
                  name="newMedicineName"
                  value={newInvoiceItemBeingEntered?.Medicine?.name ?? ''}
                  placeholder="Medicine Name"
                  onChange={(e) => {
                    if (
                      newInvoiceItemBeingEntered &&
                      newInvoiceItemBeingEntered.Medicine
                    ) {
                      setNewInvoiceItemBeingEntered({
                        ...newInvoiceItemBeingEntered,
                        Medicine: {
                          ...newInvoiceItemBeingEntered.Medicine,
                          name: e.target.value,
                        },
                      });
                    }
                  }}
                  label="Medicine name"
                />
                <InputField
                  name="newMedicineBrand"
                  value={newInvoiceItemBeingEntered?.Medicine?.brand ?? ''}
                  placeholder="Medicine Brand"
                  onChange={(e) => {
                    if (
                      newInvoiceItemBeingEntered &&
                      newInvoiceItemBeingEntered.Medicine
                    ) {
                      setNewInvoiceItemBeingEntered({
                        ...newInvoiceItemBeingEntered,
                        Medicine: {
                          ...newInvoiceItemBeingEntered.Medicine,
                          brand: e.target.value,
                        },
                      });
                    }
                  }}
                  label="Medicine brand"
                />
              </div>
              <div className="flex flex-row gap-2">
                <InputField
                  name="newMedicineFormula"
                  value={newInvoiceItemBeingEntered?.Medicine?.formula ?? ''}
                  placeholder="Medicine Formula"
                  onChange={(e) => {
                    if (
                      newInvoiceItemBeingEntered &&
                      newInvoiceItemBeingEntered.Medicine
                    ) {
                      setNewInvoiceItemBeingEntered({
                        ...newInvoiceItemBeingEntered,
                        Medicine: {
                          ...newInvoiceItemBeingEntered.Medicine,
                          formula: e.target.value,
                        },
                      });
                    }
                  }}
                  label="Medicine formula"
                />
                <InputField
                  name="newMedicineCode"
                  value={newInvoiceItemBeingEntered?.Medicine?.code ?? ''}
                  placeholder="Medicine Code"
                  onChange={(e) => {
                    if (
                      newInvoiceItemBeingEntered &&
                      newInvoiceItemBeingEntered.Medicine
                    ) {
                      setNewInvoiceItemBeingEntered({
                        ...newInvoiceItemBeingEntered,
                        Medicine: {
                          ...newInvoiceItemBeingEntered.Medicine,
                          code: e.target.value,
                        },
                      });
                    }
                  }}
                  label="Medicine Code"
                />
                <div className="flex flex-col min-w-[120pt]">
                  <Text className="text-gray-400">Medicine Type</Text>
                  <div className="mt-0 w-full">
                    <Menu
                      button={
                        <Button size="large" className="w-full">
                          {newInvoiceItemBeingEntered?.Medicine?.type
                            ? newInvoiceItemBeingEntered?.Medicine?.type
                            : 'Type'}
                        </Button>
                      }
                    >
                      {MedicineTypes.map((medicineType) => (
                        <MenuItem
                          key={medicineType}
                          onClick={() => {
                            if (newInvoiceItemBeingEntered) {
                              console.log({
                                ...newInvoiceItemBeingEntered,
                                type: medicineType,
                              });
                              if (newInvoiceItemBeingEntered?.Medicine?.name)
                                setNewInvoiceItemBeingEntered({
                                  ...newInvoiceItemBeingEntered,
                                  Medicine: {
                                    ...newInvoiceItemBeingEntered.Medicine,
                                    type: medicineType,
                                  },
                                });
                            }
                          }}
                        >
                          {medicineType}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex-row gap-2 justify-end flex">
              {false && (
                <>
                  <Button onClick={hydrateFormWithPreviousInvoiceItem}>
                    View Previouse Item
                  </Button>
                  <Button onClick={hydrateFormWithNextInvoiceItem}>
                    View Next Item
                  </Button>
                </>
              )}
              <Button onClick={addNewItemOnInvoice}>Add More</Button>
            </div>
          </div>
        </div>
      )}
      <Divider className="mb-3 mt-3" />
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="font-semibold">
          <span>Sum total: </span>
          {(invoiceData?.total ?? 0).toFixed(APP_ROUNDOFF_SETTING)}/-
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
              disabled={stepCount >= 2}
              onClick={() => setStepCount(stepCount + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
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
    </form>
  );
};

export default InvoiceForm;
