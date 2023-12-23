import { APP_TIME_FORMAT, IMedicine, MedicineTypes } from '@billinglib';
import {
  Button,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
} from '@fluentui/react-components';
import { Table as FUITable } from '@fluentui/react-components';
import moment from 'moment';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from 'react';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import InputField from '../../molecules/InputField';
import Menu from '../Menu';

interface Props {
  medicine?: IMedicine;
  setMedicine: Dispatch<SetStateAction<IMedicine | undefined>>;
}

const MedicineEditor = ({ medicine, setMedicine }: Props) => {
  const { updateMedicine } = useContext(MedicineContext);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (setMedicine && medicine) {
        setMedicine({
          ...medicine,
          [ev.target.name]: ev.target.value,
        });
      }
    },
    [medicine]
  );

  const setType = useCallback(
    (type: MedicineTypes) => {
      if (setMedicine && medicine) {
        setMedicine({
          ...medicine,
          type: type,
        });
      }
    },
    [medicine]
  );

  const onSubmit = useCallback(async () => {
    if (updateMedicine && medicine) {
      await updateMedicine(medicine);
      setMedicine(undefined);
    }
  }, [medicine]);

  return (
    <div>
      <div>Udpate Medicine Details</div>
      <FUITable>
        {medicine && (
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>
                <InputField
                  name="name"
                  value={medicine.name}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>
                <Menu
                  button={
                    <Button size="large" className="w-full">
                      {medicine.type}
                    </Button>
                  }
                >
                  {MedicineTypes.map((type) => (
                    <MenuItem key={type} onClick={() => setType(type)}>
                      {type}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>
                <InputField
                  name="brand"
                  value={medicine.brand ?? ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price</TableCell>
              <TableCell>
                <InputField
                  name="unitTakePrice"
                  value={String(medicine.unitTakePrice)}
                  onChange={handleChange}
                  type="number"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Medicine Code</TableCell>
              <TableCell>
                <InputField
                  name="code"
                  value={medicine.code ?? ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Packing type</TableCell>
              <TableCell>
                <InputField
                  name="packing"
                  value={medicine.packing ?? ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Formula</TableCell>
              <TableCell>
                <InputField
                  name="formula"
                  value={medicine.formula ?? ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Last Updated At</TableCell>
              <TableCell>
                {moment(medicine.updatedAt).format(APP_TIME_FORMAT)}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </FUITable>
      <div className="flex gap-3 justify-end mt-3">
        <Button onClick={() => setMedicine(undefined)}>Cancel</Button>
        <Button onClick={onSubmit}>Update</Button>
      </div>
    </div>
  );
};

export default MedicineEditor;
