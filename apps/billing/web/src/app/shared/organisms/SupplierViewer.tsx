import { APP_TIME_FORMAT, ISupplier } from '@billinglib';
import { TableBody, TableCell, TableRow } from '@fluentui/react-components';
import { Table as FUITable } from '@fluentui/react-components';
import { dashIfNull } from '../../utils/common';
import moment from 'moment';

interface Props {
  supplier?: ISupplier;
}

const SupplierViewer = ({ supplier }: Props) => {
  return (
    <FUITable>
      {supplier && (
        <TableBody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{dashIfNull(supplier.name)}</TableCell>
            <TableCell>License Number</TableCell>
            <TableCell>
              {dashIfNull(dashIfNull(supplier.licenseNumber))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>{dashIfNull(supplier.city)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>{dashIfNull(supplier.emails)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Telephone</TableCell>
            <TableCell>{dashIfNull(supplier.telephones)}</TableCell>
            <TableCell>Whatsapp</TableCell>
            <TableCell>{dashIfNull(supplier.whatsapps)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>NTN</TableCell>
            <TableCell>{dashIfNull(supplier.NTN)}</TableCell>
            <TableCell>STN</TableCell>
            <TableCell>{dashIfNull(supplier.STN)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TNNumber</TableCell>
            <TableCell>{dashIfNull(supplier.TNNumber)}</TableCell>
            <TableCell>TRNNumber</TableCell>
            <TableCell>{dashIfNull(supplier.TRNNumber)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created On</TableCell>
            <TableCell>
              {dashIfNull(moment(supplier.createdAt).format(APP_TIME_FORMAT))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell colSpan={3}>
              {dashIfNull(supplier.addressLine1 + supplier.addressLine2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              Total Invoices with {supplier.name}
            </TableCell>
            <TableCell colSpan={2}>
              {dashIfNull(
                ((supplier._count ?? { Invoice: 0 })?.Invoice ?? 0)?.toString()
              )}{' '}
              Invoices
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </FUITable>
  );
};

export default SupplierViewer;
