import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { useCallback, useContext, useState } from 'react';
import { Button, Input } from '@fluentui/react-components';
import { getLastRouteItem } from '../../../utils/common';
import SupplierForm from '../../../shared/organisms/supplier/SupplierForm';
import Table from '../../../shared/organisms/Table';
import { SupplierContext } from '../../../state/contexts/SupplierContext';
import { ISupplier } from '@billinglib';
import SupplierViewer from '../../../shared/organisms/supplier/SupplierViewer';
import LoaderWrapper from '../../../shared/molecules/LoaderWrapper';
import SupplierEditor from '../../../shared/organisms/supplier/SupplierEditor';

const Suppliers = () => {
  const location = useLocation();

  const { supplierList, isLoading, getSuppliers, deleteSupplier } =
    useContext(SupplierContext);
    

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

  const onViewData = useCallback(
    (_: ISupplier,index: number) => {
      if (supplierList) {
        setCurrentlyViewing(supplierList[index]);
        console.log('list' ,currentlyViewing)
      }
    },
    [currentlyViewing, supplierList]
  );

  const onEditingData = useCallback(
    (_: ISupplier, index: number) => {
      if (supplierList) {
        setCurrentlyEditing(supplierList[index]);
      }
    },
    [currentlyEditing, supplierList]
  );

  const onDeletingData = async (_: ISupplier, index: number) => {
    if (supplierList) {
      if (
        supplierList[index] &&
        supplierList[index]._count &&
        supplierList[index]._count?.Invoices
      ) {
        alert(
          `Supplier ${supplierList[index].name} shouldn't be deleted because they're associated to invoices`
        );
      } else if (deleteSupplier) {
        await deleteSupplier(supplierList[index]);
      }
    }
  };

  const closeModals = useCallback(() => {
    setCurrentlyViewing(undefined);
    setCurrentlyEditing(undefined);
  }, [currentlyEditing, currentlyViewing]);

  const getFilteredData = useCallback(() => {
    if (supplierList)
      return supplierList
        .map((supplier) => ({
          Supplier: supplier.name,
          'Phone No.': supplier.telephones,
          Email: supplier.emails,
        }))
        ?.filter(
          (data) =>
            data.Email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            data['Phone No.']
              ?.toLowerCase()
              .includes(searchQuery?.toLowerCase()) ||
            data.Supplier?.toLowerCase().includes(searchQuery?.toLowerCase())
        );
    return [];
  }, [searchQuery, supplierList]);

  return (
    <div>
      <Modal
        isOpen={!!currentlyViewing}
        onClosePressed={closeModals}
        title={`Supplier #${currentlyViewing?.id} - ${currentlyViewing?.name}`}
      >
        {!!closeModals && <SupplierViewer supplier={currentlyViewing} />}
      </Modal>
      <Modal isOpen={!!currentlyEditing} onClosePressed={closeModals}>
        {!!currentlyEditing && (
          <SupplierEditor
            supplier={currentlyEditing}
            setSupplier={setCurrentlyEditing}
          />
        )}
      </Modal>
      <div className="flex flex-row justify-end gap-2 py-5">
        <Input
          disabled={
            !!currentlyEditing || !!currentlyViewing || isCreatingRecord
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          size="medium"
        />
        <Button size="medium" onClick={getSuppliers}>
          Refresh
        </Button>
        <Modal
          isOpen={isCreatingRecord}
          hideClose={false}
          setIsOpen={setIsCreatingRecord}
          title="Add Supplier"
          triggerButton={
            <Button size="medium" onClick={toggleModel}>
              Add New
            </Button>
          }
        >
          <SupplierForm formStateSetter={setIsCreatingRecord} />
        </Modal>
      </div>
      <div>
        <LoaderWrapper isLoading={isLoading}>
          {supplierList && supplierList?.length > 0 && (
            <Table
              data={getFilteredData() as unknown as []}
              onViewData={onViewData}
              onEdit={onEditingData}
              onDelete={onDeletingData}
            />
          )}
        </LoaderWrapper>
      </div>
    </div>
  );
};

export default Suppliers;
