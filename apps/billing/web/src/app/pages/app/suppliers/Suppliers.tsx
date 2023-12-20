import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { Button, Divider } from '@fluentui/react-components';
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
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  const toggleAdditionalDetails = useCallback(
    () => setShowAdditionalDetails(!showAdditionalDetails),
    [showAdditionalDetails]
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

  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      console.log(JSON.stringify(newSupplier, null, 2));
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
        <form className="gap-2 flex flex-col" onSubmit={handleSubmit}>
          {!showAdditionalDetails && (
            <>
              <InputField
                name="emails"
                value={newSupplier?.emails}
                onChange={handleOnChange}
                label="Email"
                placeholder="Supplier email"
                type="text"
                fieldSize="large"
                labelSize="medium"
                required
              />
              <InputField
                name="name"
                value={newSupplier?.name}
                onChange={handleOnChange}
                label="Supplier Name"
                placeholder="Enter name"
                type="text"
                fieldSize="large"
                labelSize="medium"
                required
              />
              <InputField
                name="city"
                value={newSupplier?.city}
                onChange={handleOnChange}
                label="Supplier City"
                placeholder="Enter city"
                type="text"
                fieldSize="large"
                labelSize="medium"
                required
              />
              <InputField
                name="telephones"
                value={newSupplier?.telephones}
                onChange={handleOnChange}
                label="Supplier Telephone"
                placeholder="Enter telephone"
                type="text"
                fieldSize="large"
                labelSize="medium"
                required
              />
              <InputField
                name="addressLine1"
                value={newSupplier?.addressLine1}
                onChange={handleOnChange}
                label="Address Line 1"
                placeholder="Enter address line 1"
                type="text"
                fieldSize="large"
                labelSize="medium"
                required
              />
              <InputField
                name="addressLine2"
                value={newSupplier?.addressLine2}
                onChange={handleOnChange}
                label="Address Line 2"
                placeholder="Enter address line 2 (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <Divider className="my-3" />
            </>
          )}
          <Button onClick={toggleAdditionalDetails}>
            {showAdditionalDetails ? 'Hide Optionals' : 'Show Optionals'}
          </Button>
          {showAdditionalDetails && (
            <>
              <InputField
                name="whatsapps"
                value={newSupplier?.whatsapps}
                onChange={handleOnChange}
                label="Whatsapp number "
                placeholder="Enter whatsapp number (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <InputField
                name="NTN"
                value={newSupplier?.NTN}
                onChange={handleOnChange}
                label="Supplier NTN"
                placeholder="Enter supplier NTN (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <InputField
                name="STN"
                value={newSupplier?.STN}
                onChange={handleOnChange}
                label="Supplier STN"
                placeholder="Enter supplier STN (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <InputField
                name="licenseNumber"
                value={newSupplier?.licenseNumber}
                onChange={handleOnChange}
                label="Supplier License number"
                placeholder="Enter license number (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <InputField
                name="licenseNumber"
                value={newSupplier?.licenseNumber}
                onChange={handleOnChange}
                label="Supplier License number"
                placeholder="Enter license number (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <InputField
                name="TNNumber"
                value={newSupplier?.TNNumber}
                onChange={handleOnChange}
                label="Supplier TN Number"
                placeholder="Enter TN number (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
              <InputField
                name="TRNNumber"
                value={newSupplier?.TNNumber}
                onChange={handleOnChange}
                label="Supplier TRN Number"
                placeholder="Enter TRN number (Optional)"
                type="text"
                fieldSize="large"
                labelSize="medium"
              />
            </>
          )}
          <Divider className="my-3" />
          <Button type="submit" size="large" appearance="primary">
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
