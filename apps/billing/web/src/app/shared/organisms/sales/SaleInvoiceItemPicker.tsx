import { IMedicine, ISaleInvoiceItem } from '@billinglib';
import {
  Button,
  Divider,
  Input,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@fluentui/react-components';
import { ChangeEvent, useCallback, useContext, useMemo, useState } from 'react';
import { sanitizeNaN } from '../../../utils/common';
import Menu from '../Menu';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import { Delete16Regular as ClearFormIcon } from '@fluentui/react-icons';
import clsx from 'clsx';

interface Props {
  invoiceItems: ISaleInvoiceItem[];
  onAddItem: (data: ISaleInvoiceItem) => void;
  onSaveItems: () => void;
  onDeleteItem: (index: number) => void;
  onCloseForm: () => void;
  isEdititng?: boolean;
}

const SaleInvoiceItemPicker = ({
  invoiceItems,
  onAddItem,
  onDeleteItem,
  onSaveItems,
  onCloseForm,
  isEdititng = false,
}: Props) => {
  const { medicineList } = useContext(MedicineContext);
  const [searchString, setSearchString] = useState('');
  const [newInvoiceItem, setNewInvoiceItem] = useState<ISaleInvoiceItem>({
    medicinesId: 0,
    Medicine: {
      name: '',
      packing: '',
      unitTakePrice: 0,
      numOfUnitsOnStrip: 1,
      numStrips: 0,
      suplierCode: '',
      brand: '',
      code: '',
      id: 0,
      formula: '',
      quantityInStock: 0,
      type: '',
    },
    comments: '',
    quantity: 1,
    unitSalePrice: 0,
    quantitySoldFromPack: 0,
  });

  const clearForm = useCallback(() => {
    setNewInvoiceItem({
      medicinesId: 0,
      Medicine: {
        name: '',
        packing: '',
        unitTakePrice: 0,
        numOfUnitsOnStrip: 1,
        numStrips: 0,
        suplierCode: '',
        brand: '',
        code: '',
        id: 0,
        formula: '',
        quantityInStock: 0,
        type: '',
      },
      comments: '',
      quantity: 1,
      unitSalePrice: 0,
      quantitySoldFromPack: 0,
    });
    setSearchString('');
  }, [newInvoiceItem]);

  const SaveItemInArray = useCallback(() => {
    onAddItem(newInvoiceItem);
    clearForm();
  }, [newInvoiceItem]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setNewInvoiceItem({
        ...newInvoiceItem,
        [ev.target.name]: ev.target.value,
      });
    },
    [newInvoiceItem]
  );

  const filteredMedicines = useMemo(() => {
    if (medicineList && medicineList?.length > 0) {
      return medicineList?.filter((medicine) =>
        medicine?.name?.toLowerCase().includes(searchString?.toLowerCase())
      );
    }
    return [];
  }, [searchString, invoiceItems, medicineList]);

  const disableSelection = useCallback(
    (med: IMedicine) => {
      if (!med.quantityInStock) {
        return true;
      }
      return invoiceItems?.map((m) => m.Medicine?.id)?.includes(med.id);
    },
    [invoiceItems, medicineList]
  );

  const getQuantityOfItemBeforeInInvoice_forDropdown = useCallback(
    (medicine: IMedicine) => {
      const itemInCurrentlyInInvoice = invoiceItems?.find(
        (invoice) => invoice.Medicine?.id === medicine.id
      );

      if (itemInCurrentlyInInvoice) {
        return (
          (medicine?.quantityInStock ?? 0) -
          (isEdititng ? 0 : itemInCurrentlyInInvoice.quantity)
        );
      }
      return medicine?.quantityInStock ?? 0;
    },
    [invoiceItems, isEdititng, medicineList]
  );

  const getQuanityOfItemAfterInInvoice = useCallback(
    (item: ISaleInvoiceItem) => {
      return (item?.Medicine?.quantityInStock ?? 0) -
        (item?.quantity ?? 0) +
        (isEdititng ? item.quantity : 0) <
        0
        ? 'Out of Stock'
        : '';
    },
    [invoiceItems]
  );
  const outOfStockExistsOnInvoice = useMemo(() => {
    return (
      invoiceItems.findIndex(
        (item) => getQuanityOfItemAfterInInvoice(item) === 'Out of Stock'
      ) !== -1
    );
  }, [invoiceItems]);

  const isBoxedType = useMemo(() => {
    return (
      newInvoiceItem.Medicine?.type === 'Capsule' ||
      newInvoiceItem.Medicine?.type === 'Injections' ||
      newInvoiceItem.Medicine?.type === 'Tablets'
    );
  }, [newInvoiceItem]);

  const unitPriceCalculated = useMemo(() => {
    return (
      isBoxedType
        ? ((newInvoiceItem?.Medicine?.numStrips || 1) *
            (newInvoiceItem?.Medicine?.numOfUnitsOnStrip || 1)) /
          (newInvoiceItem.Medicine?.unitTakePrice || 1)
        : newInvoiceItem.Medicine?.unitTakePrice
    )?.toFixed(2);
  }, [newInvoiceItem]);

  const onSelectMedicine = useCallback(
    (data: IMedicine) => {
      console.log(unitPriceCalculated);

      if (data?.name && !disableSelection(data)) {
        let unitPrice = data?.unitTakePrice;
        if (
          data.type === 'Capsule' ||
          data.type === 'Injections' ||
          data.type === 'Tablets'
        ) {
          unitPrice =
            ((data.numStrips || 1) * (data.numOfUnitsOnStrip || 1)) /
            data.unitTakePrice;
        }

        setSearchString(data.name);
        setNewInvoiceItem({
          ...newInvoiceItem,
          Medicine: data,
          unitSalePrice: unitPrice,
        });
      }
    },
    [newInvoiceItem, searchString]
  );

  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>
                {isBoxedType
                  ? `Purchase Price per ${newInvoiceItem?.Medicine?.type?.replace(
                      /s$/,
                      ''
                    )}`
                  : 'Unit Price'}
                {isBoxedType && (
                  <div>Box price {newInvoiceItem.Medicine?.unitTakePrice}</div>
                )}
              </TableCell>
              <TableCell>
                {isBoxedType
                  ? `Sale Price per ${newInvoiceItem?.Medicine?.type?.replace(
                      /s$/,
                      ''
                    )}`
                  : 'Sale Price'}
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableHeader>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    {item?.Medicine?.name}{' '}
                    {item.Medicine?.brand && `(${item.Medicine?.brand})`}
                  </div>
                </TableCell>
                <TableCell>
                  {item && item?.Medicine && (
                    <div>
                      <span>{item?.quantity}</span>
                      <span className="text-red-600 mx-2">
                        {getQuanityOfItemAfterInInvoice(item)}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>${item?.Medicine?.unitTakePrice}</TableCell>
                <TableCell>
                  <div>${item?.unitSalePrice}</div>
                </TableCell>
                <TableCell>
                  <Button
                    size="large"
                    className="w-full"
                    onClick={() => onDeleteItem(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Menu
                  positioning={'below-start'}
                  button={
                    <Input
                      size="large"
                      className="w-full"
                      placeholder="Search Medicine..."
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                      contentAfter={
                        <ClearFormIcon
                          className="cursor-pointer"
                          onClick={clearForm}
                        />
                      }
                    />
                  }
                >
                  {filteredMedicines?.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => onSelectMedicine(med)}
                      className={clsx([
                        'cursor-pointer hover:bg-gray-100 p-2 min-w-[150pt] rounded-sm',
                        'flex justify-between',
                        disableSelection(med) &&
                          'text-gray-300 cursor-not-allowed',
                      ])}
                    >
                      <div>
                        <div className="text-md">
                          {med?.name} {med?.packing ? `(${med?.packing})` : ''}
                        </div>
                        <div className="text-xs">{med?.type}</div>
                      </div>
                      <div>
                        {sanitizeNaN(
                          String(
                            getQuantityOfItemBeforeInInvoice_forDropdown(med)
                          )
                        )}
                      </div>
                    </div>
                  ))}
                  {!isEdititng && (
                    <div
                      onClick={() => {}}
                      className="cursor-pointer hover:bg-gray-100 p-2 min-w-[150pt] rounded-sm"
                    >
                      <div className="text-md">Add New</div>
                    </div>
                  )}
                </Menu>
              </TableCell>
              <TableCell>
                <Input
                  size="large"
                  className="w-full my-1"
                  placeholder="Quantity"
                  name="quantity"
                  value={sanitizeNaN(String(newInvoiceItem.quantity))}
                  onChange={handleChange}
                  type="number"
                  min={1}
                />
              </TableCell>
              <TableCell>
                <Input
                  size="large"
                  className="w-full my-1"
                  placeholder={
                    isBoxedType
                      ? `Price per ${newInvoiceItem?.Medicine?.type}`
                      : 'Unit Price'
                  }
                  value={sanitizeNaN(String(unitPriceCalculated))}
                  disabled
                />
              </TableCell>
              <TableCell>
                <Input
                  size="large"
                  className="w-full my-1 text-red-400"
                  placeholder={
                    isBoxedType
                      ? `Sale Price per ${newInvoiceItem?.Medicine?.type}`
                      : 'Sale Price'
                  }
                  name="unitSalePrice"
                  value={sanitizeNaN(String(newInvoiceItem.unitSalePrice))}
                  onChange={handleChange}
                  type="number"
                  min={0}
                />
              </TableCell>
              <TableCell>
                <Button size="large" className="w-full" onClick={clearForm}>
                  Clear
                </Button>
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="text-end p-2">
          <Button
            disabled={
              !newInvoiceItem?.Medicine || !newInvoiceItem?.Medicine.name
            }
            onClick={SaveItemInArray}
          >
            Add
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex flex-row gap-3 justify-end pt-4">
        <Button disabled={outOfStockExistsOnInvoice} onClick={onCloseForm}>
          Close
        </Button>
        <Button
          appearance="primary"
          disabled={
            !invoiceItems || !invoiceItems?.length || outOfStockExistsOnInvoice
          }
          onClick={onSaveItems}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SaleInvoiceItemPicker;
