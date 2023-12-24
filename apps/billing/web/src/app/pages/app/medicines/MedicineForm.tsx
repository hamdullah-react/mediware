import { ChangeEvent, useCallback, useContext, useState } from 'react';
import { Button, Divider, MenuItem } from '@fluentui/react-components';
import { handleChange } from '../../../utils/common';
import InputField from '../../../shared/molecules/InputField';
import { IMedicine, MedicineTypes } from '@billinglib';
import Menu from '../../../shared/organisms/Menu';
import { MedicineContext } from '../../../state/contexts/MedicineContext';

interface Props {
  onCreateMedicine?: () => void;
}

const MedicineForm = ({ onCreateMedicine }: Props) => {
  const [newMedicine, setNewMedicine] = useState<IMedicine>({
    name: '',
    brand: '',
    formula: '',
    type: '',
    code: '',
    packing: '',
    unitTakePrice: 0,
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

  return (
    <div className="gap-2 flex flex-col">
      <div className="flex flex-row items-end gap-3">
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
        <div className="flex-1">
          <InputField
            name="code"
            value={newMedicine?.code ?? ''}
            onChange={handleOnChange}
            label="Medicine Code"
            placeholder="Enter product code"
          />
        </div>
        <InputField
          name="brand"
          value={newMedicine?.brand ?? ''}
          onChange={handleOnChange}
          label="Brand"
          placeholder="Brand"
        />
      </div>
      <div className="flex flex-row items-end gap-3">
        <InputField
          name="formula"
          value={newMedicine?.formula ?? ''}
          onChange={handleOnChange}
          label="Forumula"
          placeholder="Medicine Formula"
        />
        <InputField
          name="packing"
          value={newMedicine?.packing ?? ''}
          onChange={handleOnChange}
          label="Packing"
          placeholder="Packing Type"
        />
        <InputField
          name="unitTakePrice"
          value={String(newMedicine?.unitTakePrice ?? 0)}
          onChange={handleOnChange}
          label="Price"
          placeholder="Enter Price"
          type="number"
          min={0}
        />
      </div>
      <Divider className="my-3" />
      <div className="flex-1">
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
      <Divider className="my-3" />
      <Button onClick={handleSubmit} size="large" appearance="primary">
        {invalidForm(newMedicine) ? invalidForm(newMedicine) : 'Submit'}
      </Button>
    </div>
  );
};

export default MedicineForm;
