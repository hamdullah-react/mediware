import React, { useCallback, useContext, useState } from 'react';
import MedicineForm from './MedicineForm';
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

  const { medicineList, isLoading } = useContext(MedicineContext);

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

  const onViewData = useCallback((_: IMedicine, index: number) => {
    if (medicineList) {
      setCurrentlyViewing(medicineList[index]);
    }
  }, []);

  const onEditingData = useCallback((_: IMedicine, index: number) => {
    if (medicineList) {
      setCurrentlyEditing(medicineList[index]);
    }
  }, []);

  const clearCurrentlyViewing = useCallback(() => {
    setCurrentlyViewing(undefined);
  }, []);

  const clearCurrentlyEdting = useCallback(() => {
    setCurrentlyEditing(undefined);
  }, []);

  const getFilteredData = useCallback(() => {
    if (medicineList) {
      return medicineList
        .map((medicine) => ({
          Code: medicine.code,
          'Medicine Name': medicine.name,
          Packing: medicine.packing,
          Brand: medicine.brand,
          Formula: medicine.formula,
          Type: medicine.type,
        }))
        ?.filter(
          (data) =>
            data['Medicine Name']
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            data.Brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.Formula?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.Type?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  }, [searchQuery]);

  return (
    <div>
      <div className="p-2 text-gray-400">{location.pathname}</div>
      <Modal
        isOpen={isCreatingRecord}
        hideClose={false}
        modalType="modal"
        setIsOpen={setIsCreatingRecord}
        title="Add Medicine"
        triggerButton={<Button onClick={toggleModel}>Add Medicine</Button>}
      >
        <MedicineForm onCreateMedicine={() => setIsCreatingRecord(false)} />
      </Modal>
      <Modal
        isOpen={!!currentlyViewing}
        onClosePressed={clearCurrentlyViewing}
        title={`Medicine #${currentlyViewing?.id} ${currentlyViewing?.name} (${currentlyViewing?.type})`}
      >
        {!!currentlyViewing && <MedicineViewer medicine={currentlyViewing} />}
      </Modal>
      <Modal isOpen={!!currentlyEditing} onClosePressed={clearCurrentlyEdting}>
        {!!currentlyEditing && (
          <MedicineEditor
            medicine={currentlyEditing}
            setMedicine={setCurrentlyEditing}
          />
        )}
      </Modal>
      <div className="flex flex-row justify-end">
        <Input
          disabled={
            isCreatingRecord || !!currentlyViewing || !!currentlyEditing
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div>
        <LoaderWrapper isLoading={isLoading}>
          {medicineList && medicineList?.length > 0 && (
            <Table
              data={getFilteredData() as unknown as []}
              onViewData={onViewData}
              onEdit={onEditingData}
            />
          )}
        </LoaderWrapper>
      </div>
    </div>
  );
};

export default Medicines;
