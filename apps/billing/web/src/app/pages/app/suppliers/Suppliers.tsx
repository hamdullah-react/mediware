import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { ChangeEvent, useCallback, useState } from 'react';
import { Button } from '@fluentui/react-components';
import { getLastRouteItem, handleChange } from '../../../utils/common';
import InputField from '../../../shared/molecules/InputField';
import { ISupplier } from '@billinglib';

const Suppliers = () => {
  const location = useLocation();
  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );
  const [newSupplier, setNewSupplier] = useState<ISupplier>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    emails: '',
    licenseNumber: '',
    name: '',
    NTN: '',
    STN: '',
    telephones: '',
    TNNumber: '',
    TRNNumber: '',
    whatsapps: '',
  });

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      handleChange(
        ev.target.name,
        ev.target.value,
        newSupplier,
        setNewSupplier
      );
    },
    [newSupplier]
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
        <form>
          <InputField
            name="emails"
            value={newSupplier?.emails}
            onChange={handleOnChange}
            label=""
            placeholder=""
            type="text"
            fieldSize="large"
            labelSize="medium"
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
