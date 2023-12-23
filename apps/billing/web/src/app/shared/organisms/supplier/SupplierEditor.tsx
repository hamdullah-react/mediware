import { APP_TIME_FORMAT, ISupplier } from '@billinglib';
import {
  Button,
  Divider,
  TableBody,
  TableCell,
  TableRow,
} from '@fluentui/react-components';
import { Table as FUITable } from '@fluentui/react-components';
import { dashIfNull } from '../../../utils/common';
import moment from 'moment';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from 'react';
import InputField from '../../molecules/InputField';
import { SupplierContext } from '../../../state/contexts/SupplierContext';

interface Props {
  supplier?: ISupplier;
  setSupplier: Dispatch<SetStateAction<ISupplier | undefined>>;
}

const SupplierEditor = ({ supplier, setSupplier }: Props) => {
  const { updateSupplier } = useContext(SupplierContext);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (setSupplier && supplier) {
        setSupplier({
          ...supplier,
          [ev.target.name]: ev.target.value,
        });
      }
    },
    [supplier]
  );

  const onSubmit = useCallback(async () => {
    if (updateSupplier && supplier) {
      await updateSupplier(supplier);
      setSupplier(undefined);
    }
  }, [supplier]);

  return (
    <div>
      <div className="pb-4 text-lg font-semibold">Edit Supplier Details</div>
      <Divider className="pb-4" />
      <FUITable>
        {supplier && (
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>
                <InputField
                  name="name"
                  value={supplier.name}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>
                <InputField
                  name="licenseNumber"
                  value={supplier.licenseNumber}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>
                <InputField
                  name="city"
                  value={supplier.city}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>
                <InputField
                  name="emails"
                  value={supplier.emails}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Telephone</TableCell>
              <TableCell>
                <InputField
                  name="telephones"
                  value={supplier.telephones}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell>Whatsapp</TableCell>
              <TableCell>
                <InputField
                  name="whatsapps"
                  value={supplier.whatsapps}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>NTN</TableCell>
              <TableCell>
                <InputField
                  name="NTN"
                  value={supplier.NTN}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell>STN</TableCell>
              <TableCell>
                <InputField
                  name="STN"
                  value={supplier.STN}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TNNumber</TableCell>
              <TableCell>
                <InputField
                  name="TNNumber"
                  value={supplier.TNNumber}
                  onChange={handleChange}
                />
              </TableCell>
              <TableCell>TRNNumber</TableCell>
              <TableCell>
                <InputField
                  name="TRNNumber"
                  value={supplier.TRNNumber}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Last Updated At</TableCell>
              <TableCell>
                {dashIfNull(moment(supplier.updatedAt).format(APP_TIME_FORMAT))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address Line 1</TableCell>
              <TableCell colSpan={3}>
                <InputField
                  name="addressLine1"
                  value={supplier.addressLine1}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address Line 2</TableCell>
              <TableCell colSpan={3}>
                <InputField
                  name="addressLine2"
                  value={supplier.addressLine2}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </FUITable>
      <div className="py-4 flex gap-3 justify-end">
        <Button onClick={() => setSupplier(undefined)}>Cancel</Button>
        <Button onClick={onSubmit}>Update</Button>
      </div>
    </div>
  );
};

export default SupplierEditor;
