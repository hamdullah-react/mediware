import {
  Button,
  Table as FUITable,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@fluentui/react-components';
import moment from 'moment';
import { useCallback } from 'react';
interface Props {
  data: object[];
  onDelete?: (data: any) => void;
  onEdit?: (data: any) => void;
}

const Table = ({ data, onDelete, onEdit }: Props) => {
  const filterOut = useCallback((key: string) => {
    switch (key) {
      case 'createdAt':
        return false;
      case 'updatedAt':
        return false;
      case 'deletedAt':
        return false;
      default:
        return true;
    }
  }, []);

  return (
    <div>
      {data.length > 0 && (
        <FUITable unselectable="on">
          <TableHeader>
            <TableRow appearance="brand">
              {Object.keys(data[0])
                .filter((key) => filterOut(key))
                .map((val, index) => (
                  <TableCell className="capitalize" key={index}>
                    {val}
                  </TableCell>
                ))}
              {(onEdit || onDelete) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((val: object, index) => (
              <TableRow key={index}>
                {Object.keys(val)
                  .filter((key) => filterOut(key))
                  .map((key, subIndex) => (
                    <TableCell key={`${index}-${subIndex}`}>
                      {typeof val?.[key] !== 'object'
                        ? key.toLowerCase().includes('at')
                          ? moment(val?.[key]).format('MMM Do, YYYY hh:mm:ss')
                          : val?.[key]
                        : JSON.stringify(val?.[key])}
                    </TableCell>
                  ))}
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      {onEdit && (
                        <Button
                          onClick={() => onEdit(val)}
                          appearance="secondary"
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          onClick={() => onDelete(val)}
                          appearance="secondary"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </FUITable>
      )}
    </div>
  );
};

export default Table;
