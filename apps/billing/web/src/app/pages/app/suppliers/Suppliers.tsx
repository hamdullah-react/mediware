import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { ChangeEvent, useCallback, useState } from 'react';
import { Button } from '@fluentui/react-components';
import { getLastRouteItem } from '../../../utils/common';
import InputField from '../../../shared/molecules/InputField';
import {} from '@billing-lib';

const Suppliers = () => {
  const location = useLocation();
  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );
  const [newSupplier, setNewSupplier] = useState<ISupplier>();

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const handleChange = useCallback((ev: ChangeEvent) => {}, []);

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
            name=""
            value=""
            onChange={}
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
