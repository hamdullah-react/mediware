import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Button, Divider } from '@fluentui/react-components';
import { handleChange } from '../../../utils/common';
import InputField from '../../../shared/molecules/InputField';
import { ISupplier } from '@billinglib';
import { SupplierContext } from '../../../state/contexts/SupplierContext';

interface Props {
  onCreateSupplier?: () => void;
  formStateSetter?: Dispatch<SetStateAction<boolean>>;
}

const SupplierForm = ({ onCreateSupplier, formStateSetter }: Props) => {
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  const { createSupplier } = useContext(SupplierContext);

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

  const invalidForm = useCallback(
    (object: ISupplier): string | undefined => {
      if (!object.name) {
        return 'Please enter Name';
      }
      if (!object.emails) {
        return 'Please enter Email';
      }
      if (!object.telephones) {
        return 'Please enter Telephone';
      }
      if (!object.city) {
        return 'Please enter City';
      }
      if (!object.addressLine1) {
        return 'Please enter Address';
      }
    },
    [newSupplier]
  );

  const handleSubmit = async () => {
    if (createSupplier) {
      const error = invalidForm(newSupplier);
      if (!error) {
        if (formStateSetter) {
          formStateSetter(false);
        }
        await createSupplier(newSupplier);
        if (onCreateSupplier) onCreateSupplier();
      } else {
        alert(error);
      }
    }
  };

  return (
    <div className="gap-2 flex flex-col">
      {!showAdditionalDetails && (
        <>
          <div className="flex flex-row gap-3">
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
              name="emails"
              value={newSupplier?.emails}
              onChange={handleOnChange}
              label="Supplier Email"
              placeholder="Supplier email"
              type="email"
              fieldSize="large"
              labelSize="medium"
              required
            />
          </div>
          <div className="flex flex-row gap-3">
            <InputField
              name="telephones"
              value={newSupplier?.telephones}
              onChange={handleOnChange}
              label="Supplier Telephone"
              placeholder="Enter telephone"
              type="tel"
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
          </div>
          <div className="flex flex-row gap-3">
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
          </div>
          <Divider className="my-3" />
        </>
      )}
      <Button size="large" onClick={toggleAdditionalDetails}>
        {showAdditionalDetails ? 'Hide Optionals' : 'Show Optionals'}
      </Button>

      {showAdditionalDetails && (
        <>
          <div className="flex flex-row gap-3">
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
              name="whatsapps"
              value={newSupplier?.whatsapps}
              onChange={handleOnChange}
              label="Whatsapp number "
              placeholder="Enter whatsapp number (Optional)"
              type="tel"
              fieldSize="large"
              labelSize="medium"
            />
          </div>
          <div className="flex flex-row gap-3">
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
          </div>

          <div className="flex flex-row gap-3">
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
              value={newSupplier?.TRNNumber}
              onChange={handleOnChange}
              label="Supplier TRN Number"
              placeholder="Enter TRN number (Optional)"
              type="text"
              fieldSize="large"
              labelSize="medium"
            />
          </div>
        </>
      )}
      <Divider className="my-3" />
      <Button size="large" appearance="primary" onClick={handleSubmit}>
        {invalidForm(newSupplier) ?? 'Submit'}
      </Button>
    </div>
  );
};

export default SupplierForm;
