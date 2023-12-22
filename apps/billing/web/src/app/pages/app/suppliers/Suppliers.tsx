import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { useCallback, useContext, useState } from 'react';
import { Button, Input } from '@fluentui/react-components';
import { getLastRouteItem } from '../../../utils/common';
import SupplierForm from './SupplierForm';
import Table from '../../../shared/organisms/Table';
import { SupplierContext } from '../../../state/contexts/SupplierContext';
import { ISupplier } from '@billinglib';

const Suppliers = () => {
  const location = useLocation();

  const { supplierList } = useContext(SupplierContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyViewing, setCurrentlyViewing] = useState<ISupplier>();

  const [currentlyEditing, setCurrentlyEditing] = useState<ISupplier>();

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const onViewData = useCallback((_: ISupplier, index: number) => {
    if (supplierList) {
      setCurrentlyViewing(supplierList[index]);
    }
  }, []);

  const onEditingData = useCallback((_: ISupplier, index: number) => {
    if (supplierList) {
      setCurrentlyEditing(supplierList[index]);
    }
  }, []);

  const clearCurrentlyViewing = useCallback(() => {
    setCurrentlyViewing(undefined);
  }, []);

  const clearCurrentlyEdting = useCallback(() => {
    setCurrentlyEditing(undefined);
  }, []);

  const onUpdateSuppler = useCallback(() => {}, []);

  const getFilteredData = useCallback(() => {
    if (supplierList)
      return supplierList
        .map((supplier) => ({
          Id: supplier.id,
          Supplier: supplier.name,
          'Phone No.': supplier.telephones,
          Emails: supplier.emails,
          'Whatsapp Tel': supplier.whatsapps,
        }))
        ?.filter(
          (data) =>
            data.Emails.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data['Phone No.']
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            data.Supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data['Whatsapp Tel']
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
    return [];
  }, [searchQuery]);

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
      <Modal isOpen={!!currentlyViewing} onClosePressed={clearCurrentlyViewing}>
        {!!clearCurrentlyViewing && (
          <div>{JSON.stringify(currentlyViewing)}</div>
        )}
      </Modal>
      <Modal isOpen={!!currentlyEditing} onClosePressed={clearCurrentlyEdting}>
        {!!currentlyEditing && (
          <div>
            {JSON.stringify(currentlyEditing)}
            <div className="flex flex-row justify-end mt-4">
              <Button onClick={onUpdateSuppler}>Editing</Button>
            </div>
          </div>
        )}
      </Modal>
      <div className="flex flex-row justify-end">
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div>
        {supplierList && supplierList?.length > 0 && (
          <Table
            data={getFilteredData() as unknown as []}
            onViewData={onViewData}
            onEdit={onEditingData}
          />
        )}
      </div>
    </div>
  );
};

export default Suppliers;
