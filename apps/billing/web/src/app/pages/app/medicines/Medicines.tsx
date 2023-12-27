import React, { useCallback, useContext, useState } from 'react';
import MedicineForm from '../../../shared/organisms/medicine/MedicineForm';
import Modal from '../../../shared/organisms/Modal';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import { Button, Input } from '@fluentui/react-components';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import Table from '../../../shared/organisms/Table';
import { IMedicine } from '@billinglib';
import MedicineViewer from '../../../shared/organisms/medicine/MedicineViewer';
import LoaderWrapper from '../../../shared/molecules/LoaderWrapper';
import MedicineEditor from '../../../shared/organisms/medicine/MedicineEditor';

const Medicines = () => {
  const location = useLocation();

  const { medicineList, isLoading, getMedicines, deleteMedicine } =
    useContext(MedicineContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyViewing, setCurrentlyViewing] = useState<IMedicine>();

  const [currentlyEditing, setCurrentlyEditing] = useState<IMedicine>();

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const onViewData = useCallback(
    (_: IMedicine, index: number) => {
      if (medicineList) {
        setCurrentlyViewing(medicineList[index]);
      }
    },
    [currentlyViewing, medicineList]
  );

  const onEditingData = useCallback(
    (_: IMedicine, index: number) => {
      if (medicineList) {
        setCurrentlyEditing(medicineList[index]);
      }
    },
    [currentlyEditing, medicineList]
  );

  const onDeletingData = async (_: IMedicine, index: number) => {
    if (medicineList) {
      if (
        medicineList[index] &&
        medicineList[index]._count &&
        medicineList[index]._count?.InvoiceMedicine
      ) {
        alert(
          `Medicine ${medicineList[index].name} shouldn't be deleted because it's associated to invoices`
        );
      } else if (deleteMedicine) {
        await deleteMedicine(medicineList[index]);
      }
    }
  };

  const closeModals = useCallback(() => {
    setCurrentlyViewing(undefined);
    setCurrentlyEditing(undefined);
  }, [currentlyEditing, currentlyViewing]);

  const getFilteredData = useCallback(() => {
    if (medicineList) {
      return medicineList
        .map((medicine) => ({
          Code: medicine.code,
          'Medicine Name': `${medicine.name} (${medicine.type})`,
          Packing: medicine.packing,
          Brand: medicine.brand,
          Quantity: medicine.quantityInStock,
          'Unit Price': medicine.unitTakePrice,
        }))
        ?.filter(
          (data) =>
            data['Medicine Name']
              ?.toLowerCase()
              .includes(searchQuery?.toLowerCase()) ||
            data.Brand?.toLowerCase().includes(searchQuery?.toLowerCase())
        );
    }
  }, [searchQuery, medicineList]);

  return (
    <div>
      <Modal
        isOpen={!!currentlyViewing}
        onClosePressed={closeModals}
        title={`Medicine #${currentlyViewing?.id} ${currentlyViewing?.name} (${currentlyViewing?.type})`}
      >
        {!!currentlyViewing && <MedicineViewer medicine={currentlyViewing} />}
      </Modal>
      <Modal isOpen={!!currentlyEditing} onClosePressed={closeModals}>
        {!!currentlyEditing && (
          <MedicineEditor
            medicine={currentlyEditing}
            setMedicine={setCurrentlyEditing}
          />
        )}
      </Modal>
      <div className="flex flex-row justify-end gap-2 py-5">
        <Input
          disabled={
            isCreatingRecord || !!currentlyViewing || !!currentlyEditing
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          size="medium"
        />
        <Button size="medium" onClick={getMedicines}>
          Refresh
        </Button>
        <Modal
          isOpen={isCreatingRecord}
          hideClose={false}
          setIsOpen={setIsCreatingRecord}
          title="Add Medicine"
          triggerButton={
            <Button size="medium" onClick={toggleModel}>
              Add New
            </Button>
          }
        >
          <MedicineForm onCreateMedicine={() => setIsCreatingRecord(false)} />
        </Modal>
      </div>
      <div>
        <LoaderWrapper isLoading={isLoading}>
          {medicineList && medicineList?.length > 0 && (
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

export default Medicines;
