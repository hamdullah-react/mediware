import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Button, Divider, MenuItem } from '@fluentui/react-components';
import { handleChange } from '../../../utils/common';
import InputField from '../../../shared/molecules/InputField';
import { IMedicine, MedicineTypes } from '@billinglib';
import Menu from '../../../shared/organisms/Menu';
import { MedicineContext } from '../../../state/contexts/MedicineContext';

interface Props {
  formType?: 'new-entry' | 'edit-existing';
  onRegisterNewDevice?: (data: IMedicine) => void;
}

const MedicineForm = ({
  formType = 'new-entry',
  onRegisterNewDevice,
}: Props) => {
  const [newMedicine, setNewMedicine] = useState<IMedicine>({
    name: '',
    brand: '',
    formula: '',
    type: '',
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

  const handleSubmit = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (createMedicine) {
        createMedicine(newMedicine);
      }
    },
    [createMedicine, newMedicine]
  );

  return (
    <form className="gap-2 flex flex-col" onSubmit={handleSubmit}>
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
        <div>
          <Menu
            button={
              <Button size="large">
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
      <div className="flex flex-row gap-3">
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
          label="Forumula"
          placeholder="Medicine Formula"
        />
      </div>
      <Divider className="my-3" />
      <Button type="submit" size="large" appearance="primary">
        Submit
      </Button>
    </form>
  );
};

export default MedicineForm;
