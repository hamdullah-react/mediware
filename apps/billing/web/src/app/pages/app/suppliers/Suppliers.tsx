import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { useCallback, useContext, useState } from 'react';
import { Button } from '@fluentui/react-components';
import { getLastRouteItem } from '../../../utils/common';
import SupplierForm from './SupplierForm';
import Table from '../../../shared/organisms/Table';
import { SupplierListCtx } from '../../../state/contexts/SupplierContext';

const Suppliers = () => {
  const location = useLocation();

  const { supplierList } = useContext(SupplierListCtx);

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );
  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  return (
    <div>
      <div className="p-2 text-gray-400">{location.pathname}</div>
      <Modal
        isOpen={isCreatingRecord}
        hideClose={false}
        modalType="modal"
        setIsOpen={setIsCreatingRecord}
        title="Add Supplier"
        triggerButton={<Button onClick={toggleModel}>Add New</Button>}
      >
        <SupplierForm />
      </Modal>
      <div>
        {supplierList && supplierList?.length > 0 && (
          <Table
            headers={[]}
            data={supplierList}
            onDelete={(data) => {
              console.log(data);
            }}
            onEdit={(data) => {
              console.log(data);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Suppliers;
