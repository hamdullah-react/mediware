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
import { handleChange, sanitizeNaN } from '../../../utils/common';
import { IInvoice, IInvoiceMedicine, IMedicine } from '@billinglib';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import Menu from '../Menu';
import { Button, Input, MenuItem } from '@fluentui/react-components';
import Modal from '../Modal';
import MedicineForm from '../medicine/MedicineForm';
import InputField from '../../molecules/InputField';
import { InvoiceContext } from '../../../state/contexts/InvoiceContext';
import { Delete16Regular as ClearFormIcon } from '@fluentui/react-icons';

interface Props {
  invoiceData: IInvoice;
  setInvoiceData: Dispatch<SetStateAction<IInvoice | undefined>>;
}

const InvoiceItemPicker = ({ invoiceData, setInvoiceData }: Props) => {
  const { medicineList } = useContext(MedicineContext);
  const { invoiceList } = useContext(InvoiceContext);

  const [showMedicineCreationForm, setShowMedicineCreationForm] =
    useState(false);
  const [medicineSearchName, setMedicineSearchName] = useState('');

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

  const getFilteredMedicineList = () => {
    const result = medicineList?.filter((med) =>
      med.name.toLowerCase().includes(medicineSearchName.toLowerCase())
    );
    if (result && result.length) {
      return result;
    }
    return [];
  };

  const onSelectInvoiceItem = useCallback(
    (med: IMedicine) => {
      setMedicineSearchName(med.name);
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

  const onClickSaveArticle = useCallback(() => {
    if (invoiceData && invoiceData.InvoiceMedicines) {
      setMedicineSearchName('');
      setInvoiceData({
        ...invoiceData,
        InvoiceMedicines: [
          ...invoiceData.InvoiceMedicines,
          newInvoiceItemBeingEntered,
        ],
      });
    }
    setNewInvoiceItemBeingEntered({
      ...newInvoiceItemBeingEntered,
      batchIdentifier: '',
    });
  }, [newInvoiceItemBeingEntered, invoiceData, medicineSearchName]);

  // const checkUniqueBatchNumber = useCallback(() => {
  //   if (!newInvoiceItemBeingEntered.batchIdentifier) {
  //     return false;
  //   }
  //   const existingInvoiceItems = invoiceData.InvoiceMedicines?.map(
  //     (rec) => rec.batchIdentifier
  //   );
  //   if (existingInvoiceItems && existingInvoiceItems.length > 0) {
  //     return !existingInvoiceItems.includes(
  //       newInvoiceItemBeingEntered.batchIdentifier
  //     );
  //   }
  //   return true;
  // }, [newInvoiceItemBeingEntered]);

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

  const allBatchNumbers = useMemo(() => {
    if (invoiceList) {
      const allbatches = invoiceList.map((invoice) =>
        invoice.InvoiceMedicines?.filter(
          (e) => e.Medicine?.id === newInvoiceItemBeingEntered.Medicine?.id
        )?.map((invoiceItem) => invoiceItem.batchIdentifier)
      );

      return [
        ...new Set(
          allbatches.reduce((a, b) => [...(a ?? []), ...(b ?? [])], [])
        ),
      ];
    }

    return [];
  }, [invoiceData, newInvoiceItemBeingEntered]);

  useEffect(calculateNetAmount, [
    newInvoiceItemBeingEntered.unitSalePrice,
    newInvoiceItemBeingEntered.quantity,
    newInvoiceItemBeingEntered.discountPercentage,
    newInvoiceItemBeingEntered.advTax,
    newInvoiceItemBeingEntered.gst,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <Menu
          positioning={'below-start'}
          button={
            <Input
              size="large"
              className="w-full"
              placeholder="Search Medicine..."
              value={medicineSearchName}
              onChange={(e) => setMedicineSearchName(e.target.value)}
              contentAfter={
                <ClearFormIcon
                  className="cursor-pointer"
                  onClick={() => setMedicineSearchName('')}
                />
              }
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

        <Menu
          button={
            <Input
              size="large"
              placeholder="Batch No."
              name="batchIdentifier"
              onChange={handleChangeOnNewInvoiceItem}
              value={newInvoiceItemBeingEntered.batchIdentifier}
              autoComplete=""
            />
          }
        >
          {allBatchNumbers?.map((batch) => (
            <MenuItem
              key={batch}
              onClick={() =>
                setNewInvoiceItemBeingEntered({
                  ...newInvoiceItemBeingEntered,
                  batchIdentifier: batch,
                })
              }
            >
              {batch}
            </MenuItem>
          ))}
        </Menu>

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
          label="Quantity"
          placeholder="Enter Quanitity"
          name="quantity"
          value={String(newInvoiceItemBeingEntered.quantity)}
          onChange={handleChangeOnNewInvoiceItem}
          type="number"
          min={1}
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
          label="Disc. %"
          placeholder="Enter Discount %"
          name="discountPercentage"
          value={String(newInvoiceItemBeingEntered.discountPercentage)}
          onChange={handleChangeOnNewInvoiceItem}
          type="number"
          min={0}
        />
      </div>
      <div className="flex flex-row items-center gap-3 justify-end">
        <div className="bg-blue-100 text-blue-500 p-[7pt] text-md font-semibold px-3 rounded-md">
          Net Amount{' '}
          {sanitizeNaN(String(newInvoiceItemBeingEntered.netAmount.toFixed(2)))}
        </div>

        <Button
          size="large"
          onClick={onClickSaveArticle}
          disabled={!medicineSearchName}
        >
          Save Article
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItemPicker;
