import { APP_TIME_FORMAT, IMedicine } from '@billinglib';
import { TableBody, TableCell, TableRow } from '@fluentui/react-components';
import { Table as FUITable } from '@fluentui/react-components';
import moment from 'moment';
import { dashIfNull, sanitizeNaN } from '../../utils/common';

interface Props {
  medicine?: IMedicine;
}

const MedicineViewer = ({ medicine }: Props) => {
  return (
    <FUITable>
      {medicine && (
        <TableBody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{dashIfNull(medicine.name)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>{dashIfNull(medicine.type)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell>{dashIfNull(medicine.brand)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>
              {dashIfNull(sanitizeNaN(String(medicine.unitTakePrice)))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Formula</TableCell>
            <TableCell>{dashIfNull(medicine.formula)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>
              {moment(medicine.createdAt).format(APP_TIME_FORMAT)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Occurances in Invoices</TableCell>
            <TableCell>
              {dashIfNull(
                (
                  (medicine?._count ?? { InvoiceMedicine: 0 })
                    ?.InvoiceMedicine ?? 0
                ).toString()
              )}{' '}
              Invoices
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </FUITable>
  );
};

export default MedicineViewer;
