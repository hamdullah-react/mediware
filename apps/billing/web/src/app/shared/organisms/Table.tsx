import {
  Button,
  Table as FUITable,
  MenuItem,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@fluentui/react-components';
import moment from 'moment';
import Menu from './Menu';
import clsx from 'clsx';
import { APP_TIME_FORMAT } from '@billinglib';

interface Props<Type> {
  data: Type[];
  headers?: string[];
  onDelete?: (data: Type, index: number) => void;
  onEdit?: (data: Type, index: number) => void;
  onAddData?: () => void;
  onViewData?: (data: Type, index: number) => void;
  minHeight?: string;
}

const Table = <Type,>({
  data,
  onDelete,
  onEdit,
  headers,
  onViewData,
  minHeight = 'min-h-[80vh]',
  onAddData,
}: Props<Type>) => {
  return (
    <div className={clsx(['w-full overflow-auto', minHeight])}>
      {onAddData && (
        <div className="flex flex-row justify-end">
          <Button size="small" className="p-5" onClick={onAddData}>
            Add New
          </Button>
        </div>
      )}
      {data && data?.length > 0 ? (
        <FUITable>
          <TableHeader>
            {headers && headers.length > 0 ? (
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            ) : (
              <TableRow>
                {Object.keys(data[0] as Type[]).map((key) => (
                  <TableCell key={key} className="capitalize">
                    {key}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && <TableCell>Actions</TableCell>}
              </TableRow>
            )}
          </TableHeader>
          {typeof data[0] === 'object' && (
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={`${JSON.stringify(row)}-${index}`}>
                  {Object.keys(row as object).map((column, index) => {
                    const value = Object.values(row as object).at(index);
                    return (
                      <TableCell key={`${index}${JSON.stringify(value)}`}>
                        {column?.toLowerCase().includes('tedat')
                          ? moment(value).format(APP_TIME_FORMAT)
                          : value}
                      </TableCell>
                    );
                  })}
                  {(onEdit || onDelete || onViewData) && (
                    <TableCell>
                      <div className="flex flex-row gap-2">
                        <Menu button={<Button size="medium">Action</Button>}>
                          {onViewData && (
                            <MenuItem onClick={() => onViewData(row, index)}>
                              View
                            </MenuItem>
                          )}
                          {onEdit && (
                            <MenuItem onClick={() => onEdit(row, index)}>
                              Edit
                            </MenuItem>
                          )}
                          {onDelete && (
                            <MenuItem onClick={() => onDelete(row, index)}>
                              Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          )}
        </FUITable>
      ) : (
        <div className="flex gap-3 flex-col items-center justify-center min-h-[20vh]">
          <div className="">Looks like there is no data</div>
        </div>
      )}
    </div>
  );
};

export default Table;
