import React, { useCallback, useContext, useState } from 'react';
import MedicineForm from './MedicineForm';
import Modal from '../../../shared/organisms/Modal';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import { Button, Input } from '@fluentui/react-components';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import Table from '../../../shared/organisms/Table';

const Medicines = () => {
  const location = useLocation();

  const { medicineList } = useContext(MedicineContext);

  const [searchQuery, setSearchQuery] = useState('');

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const getFilteredData = useCallback(() => {
    if (medicineList) {
      return medicineList
        .map((medicine) => ({
          Id: medicine.id,
          'Medicine Name': medicine.name,
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
        <MedicineForm />
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
        {medicineList && medicineList?.length > 0 && (
          <Table
            data={getFilteredData() as unknown as []}
            // onDelete={deleteMedicine}
            // onEdit={updateMedicine}
          />
        )}
      </div>
    </div>
  );
};

export default Medicines;
