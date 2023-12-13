import {
  Button,
  Input,
  MenuDivider,
  MenuItem,
  MenuList,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@fluentui/react-components';

import { ChangeEvent, useCallback, useState } from 'react';
import Menu from '../../../shared/organisms/Menu';
import { useNavigate } from 'react-router-dom';

const MedicinesList = () => {
  const [queryString, setQueryString] = useState('');
  const navigate = useNavigate();

  const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
  }, []);

  const onPressSearch = useCallback(() => {
    console.log(queryString);
  }, [queryString]);

  const onNavigate = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const buttonLabel = e.currentTarget.textContent;
      switch (buttonLabel) {
        case 'Capsules':
          navigate('capsules/insert');
          break;
        case 'Syrups':
          navigate('syrups/insert');
          break;
        case 'Inhalers':
          navigate('inhalers/insert');
          break;
        case 'Injections':
          navigate('injections/insert');
          break;
        case 'Drops':
          navigate('drops/insert');
          break;
        case 'Topicals':
          navigate('topicals/insert');
          break;
        case 'Suppositories':
          navigate('suppositories/insert');
          break;
        case 'Brands':
          navigate('/brands/insert');
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  return (
    <div>
      <div className="my-3 flex items-center justify-between">
        <Menu button={<Button>Add Medicine</Button>}>
          <MenuList>
            <MenuItem onClick={onNavigate}>Capsules</MenuItem>
            <MenuItem onClick={onNavigate}>Syrups</MenuItem>
            <MenuItem onClick={onNavigate}>Inhalers</MenuItem>
            <MenuItem onClick={onNavigate}>Injections</MenuItem>
            <MenuItem onClick={onNavigate}>Drops</MenuItem>
            <MenuItem onClick={onNavigate}>Topicals</MenuItem>
            <MenuItem onClick={onNavigate}>Suppositories</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onNavigate}>Brands</MenuItem>
          </MenuList>
        </Menu>
        <div className="flex items-center gap-2">
          <Input
            size="medium"
            placeholder="Search"
            value={queryString}
            onChange={handleQueryChange}
          />
          <Button size="medium" onClick={onPressSearch}>
            Search
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Formula</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Medicine</TableCell>
            <TableCell>geryzine</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Medicine</TableCell>
            <TableCell>geryzine</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicinesList;
