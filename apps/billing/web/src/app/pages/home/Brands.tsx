import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Input } from '@fluentui/react-components';
import { getLastRouteItem } from '../../utils/common';
import Table from '../../shared/organisms/Table';
import NewBrand from '../../forms/brands/NewBrand';
import { BrandListsCtx } from '../../state/contexts/BrandsCtx';

const Brands = () => {
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [brands, , , deletebrand] = useContext(BrandListsCtx);

  const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
  }, []);

  const onPressSearch = useCallback(() => {
    console.log(queryString);
  }, [queryString]);

  const toggleModalOpen = useCallback(() => setIsAdding(!isAdding), [isAdding]);

  useEffect(() => {
    if (getLastRouteItem(location.pathname) === 'insert') {
      setIsAdding(true);
    }
  }, [location]);

  return (
    <div>
      <NewBrand isOpen={isAdding} setIsOpen={setIsAdding} />
      <div className="my-3 flex items-center justify-between">
        <Button onClick={toggleModalOpen}>Add New</Button>
        <div className="flex items-center gap-2">
          <Input
            size="large"
            placeholder="Search"
            value={queryString}
            onChange={handleQueryChange}
          />
          <Button size="large" onClick={onPressSearch}>
            Search
          </Button>
        </div>
      </div>
      <div className="mt-14 max-h-[75vh] overflow-y-auto">
        <Table data={brands as object[]} onDelete={deletebrand} />
      </div>
    </div>
  );
};

export default Brands;
