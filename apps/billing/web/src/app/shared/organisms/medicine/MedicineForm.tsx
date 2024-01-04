import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button, Divider, MenuItem } from '@fluentui/react-components';
import { handleChange } from '../../../utils/common';
import InputField from '../../molecules/InputField';
import { IMedicine, MedicineTypes } from '@billinglib';
import Menu from '../Menu';
import { MedicineContext } from '../../../state/contexts/MedicineContext';

interface Props {
  disableInput?: boolean;
  onCreateMedicine?: () => void;
}

const MedicineForm = ({ disableInput = false, onCreateMedicine }: Props) => {
  const [newMedicine, setNewMedicine] = useState<IMedicine>({
    name: '',
    brand: '',
    formula: '',
    type: '',
    code: '',
    suplierCode: '',
    packing: '',
    unitTakePrice: 0,
    numStrips: 0,
    numOfUnitsOnStrip: 0,
  });

  const { createMedicine } = useContext(MedicineContext);

  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      handleChange(
        ev.target.name,
        ev.target.value,
        newMedicine,
        setNewMedicine
      );
    },
    [newMedicine]
  );

  const invalidForm = useCallback(
    (object: IMedicine) => {
      if (!object.name) {
        return 'Please enter Name';
      }
      if (!object.type) {
        return 'Please select Type';
      }
      if (!object.packing) {
        return 'Please provide packing type';
      }
      if (!object.unitTakePrice) {
        return 'Please provide a Price';
      }
      return;
    },
    [newMedicine]
  );

  const handleSubmit = useCallback(async () => {
    if (createMedicine) {
      const error = invalidForm(newMedicine);
      if (!error) {
        await createMedicine(newMedicine);
        if (onCreateMedicine) onCreateMedicine();
      } else {
        alert(error);
      }
    }
  }, [createMedicine, newMedicine]);

  const isBoxedWithStrips = useMemo(() => {
    return (
      newMedicine.type === 'Capsule' ||
      newMedicine.type === 'Injections' ||
      newMedicine.type === 'Tablets'
    );
  }, [newMedicine]);

  const updatePackingWithStripInfo = useCallback(() => {
    if (newMedicine && isBoxedWithStrips) {
      setNewMedicine({
        ...newMedicine,
        packing: `${newMedicine?.numStrips}x${newMedicine?.numOfUnitsOnStrip}`,
      });
    }
  }, [newMedicine]);

  useEffect(updatePackingWithStripInfo, [
    newMedicine.numStrips,
    newMedicine.numOfUnitsOnStrip,
    newMedicine.packing,
  ]);

  return (
    <div className="gap-2 flex flex-col w-full">
      <Divider className="mt-3" />
      <div className="mb-3 text-gray-500 text-sm">Medicine Info</div>
      <div className="grid grid-flow-row grid-cols-3 gap-3">
        <div className="flex-1">
          <InputField
            name="name"
            value={newMedicine?.name}
            onChange={handleOnChange}
            label="Name"
            placeholder="Medicine Name"
            required
          />
        </div>
        {/* <div className="flex-1">
          <InputField
            name="code"
            value={newMedicine?.code ?? ''}
            onChange={handleOnChange}
            label="Medicine Code"
            placeholder="Enter product code"
          />
        </div> */}
        <InputField
          name="suplierCode"
          value={newMedicine?.suplierCode ?? ''}
          onChange={handleOnChange}
          label="Supplier Code"
          placeholder="Add Supplier Code"
        />
        <InputField
          name="brand"
          value={newMedicine?.brand ?? ''}
          onChange={handleOnChange}
          label="Brand"
          placeholder="Brand"
        />
        <InputField
          name="formula"
          value={newMedicine?.formula ?? ''}
          onChange={handleOnChange}
          label="Generic Name"
          placeholder="Generic/Formula"
          className="flex-1"
        />
        <div className="flex-1 flex items-end col-span-2">
          <Menu
            button={
              <Button size="large" className="w-full">
                {newMedicine?.type ? newMedicine.type : 'Type'}
              </Button>
            }
          >
            {MedicineTypes.map((medicine) => (
              <MenuItem
                key={medicine}
                onClick={() =>
                  handleChange('type', medicine, newMedicine, setNewMedicine)
                }
              >
                {medicine}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <Divider className="mt-3" />
      <div className="mb-3 text-gray-500 text-sm">Generic Info</div>
      <div className="grid grid-cols-3 grid-flow-row gap-3">
        {isBoxedWithStrips ? (
          <>
            <InputField
              name="numStrips"
              value={String(newMedicine?.numStrips ?? 0)}
              onChange={handleOnChange}
              label="No. Strips"
              placeholder="# Strips in box"
              className="flex-1"
              type="number"
              min={1}
            />
            <InputField
              name="numOfUnitsOnStrip"
              value={String(newMedicine?.numOfUnitsOnStrip ?? 0)}
              onChange={handleOnChange}
              label={`No. ${newMedicine.type} per strips`}
              placeholder="# Tablets per strip"
              className="flex-1"
              type="number"
              min={1}
            />
          </>
        ) : (
          <InputField
            name="packing"
            value={newMedicine?.packing ?? ''}
            onChange={handleOnChange}
            label="Packing"
            placeholder="Packing Type"
            className="flex-1"
          />
        )}
        <InputField
          name="unitTakePrice"
          value={String(newMedicine?.unitTakePrice ?? 0)}
          onChange={handleOnChange}
          label={isBoxedWithStrips ? 'Box Price' : 'Price (Optional)'}
          placeholder={isBoxedWithStrips ? 'Box Price' : 'Enter Price'}
          type="number"
          className="flex-1"
          min={0}
        />
      </div>
      <Divider className="my-3" />
      <Button onClick={handleSubmit} size="large" appearance="primary">
        {invalidForm(newMedicine) ? invalidForm(newMedicine) : 'Submit'}
      </Button>
    </div>
  );
};

export default MedicineForm;
