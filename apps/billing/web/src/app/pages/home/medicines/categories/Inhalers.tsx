import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Modal from '../../../../shared/organisms/Modal';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../../utils/common';
import Table from '../../../../shared/organisms/Table';
import { Button, Input } from '@fluentui/react-components';

const Inhalers = () => {
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [queryString, setQueryString] = useState('');

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
      <Modal isOpen={isAdding} setIsOpen={setIsAdding}>
        <div>form comes here</div>
      </Modal>
      <div className="my-3 flex items-center justify-between">
        <Button onClick={toggleModalOpen}>Add New</Button>
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
      <div>
        <Table
          data={[
            {
              a: 'val',
              b: 'val2',
              c: 'object',
            },
            {
              a: 'val',
              b: 'val2',
              c: 'val3',
            },
            {
              a: 'val',
              b: 'val2',
              c: 'val3',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Inhalers;
