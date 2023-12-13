/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Button, Divider, Input, Spinner } from '@fluentui/react-components';
import { BrandsCtx } from '../../../state/contexts/BrandsCtx';
import Modal from '../../../shared/organisms/Modal';
import InputField from '../../../shared/molecules/InputField';
import NewMedicine from '../NewMedicine';
import clsx from 'clsx';
import { HttpClient, errorHandler } from '../../../utils/common';

interface Props {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const NewCapsule = ({ setIsOpen, isOpen = false }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [brands] = useContext(BrandsCtx);
  const [step, setStep] = useState(0);
  const [capsuleBrand, setCapsuleBrand] = useState<any>({});
  const [newMedicine, setNewMedicine] = useState({
    dosage: '',
    formula: '',
    genericName: '',
    sideEffect: '',
    usage: '',
    brandId: null,
  });
  const [newCapsule, setNewCapsule] = useState({
    color: '',
    composition: '',
    packaging: '',
    releaseProfile: '',
    shape: '',
    size: '',
    storageRequirements: '',
    strength: '',
    quantity: '',
    medicineId: -1,
  });

  const handleChangeMedicine = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setNewMedicine({
        ...newMedicine,
        [ev.target.name]: ev.target.value,
      });
    },
    [newMedicine]
  );

  const handleChangeCapsule = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setNewCapsule({
        ...newCapsule,
        [ev.target.name]: ev.target.value,
      });
    },
    [newCapsule]
  );

  const onSaveMedicine = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (capsuleBrand?.id) {
          setIsLoading(true);
          const response = (
            await HttpClient().post('/medicines', {
              ...newMedicine,
              brandId: capsuleBrand.id,
            })
          ).data;

          setNewCapsule({
            ...newCapsule,
            medicineId: response.data?.id,
          });

          setIsLoading(false);
          setStep(step + 1);
        } else {
          alert('No brand Selected');
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        errorHandler({ error });
      }
    },
    [capsuleBrand.id, newCapsule, newMedicine, step]
  );

  const onSaveCapsule = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (newCapsule.medicineId !== -1) {
          setIsLoading(true);
          await HttpClient().post('/medicines/capsule', newCapsule);
          setIsOpen(false);
          setAddingMedicine(false);
          setIsLoading(false);
        } else {
          alert('Unfinished or unsaved details on previous page');
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        errorHandler({ error });
      }
    },
    [newCapsule, setIsOpen]
  );

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="New Capsule"
      hideClose={isLoading}
    >
      <div>
        {isLoading ? (
          <div className="py-10">
            <Spinner label={'Please Wait'} labelPosition="below" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {step === 0 && (
              <>
                <NewMedicine
                  setIsOpen={setAddingMedicine}
                  isOpen={addingMedicine}
                />
                <div className="flex flex-row justify-between gap-4">
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Search Existing brand database"
                    size="large"
                    className="flex-1"
                  />
                  <Button onClick={() => setAddingMedicine(true)}>
                    New Brand
                  </Button>
                </div>
                <div className="max-h-[300pt] overflow-y-scroll px-2">
                  {brands
                    ?.filter((brand) =>
                      brand?.name
                        .toLowerCase()
                        .includes(newBrandName.toLowerCase())
                    )
                    ?.map((brand) => (
                      <div
                        key={brand.id}
                        onClick={() => {
                          setCapsuleBrand(brand);
                          setNewBrandName(brand.name);
                          setStep(step + 1);
                        }}
                        className={clsx([
                          'cursor-pointer p-2 px-3 rounded-lg hover:bg-gray-200',
                          'active:bg-gray-300 active:scale-95 transition-all duration-200',
                          brand.id === capsuleBrand?.id &&
                            'bg-blue-500 text-white',
                        ])}
                      >
                        {brand.name}
                      </div>
                    ))}
                </div>

                <div className="h-2" />
              </>
            )}
            {step === 1 && (
              <form onSubmit={onSaveMedicine}>
                <div className="flex flex-col gap-1">
                  <InputField
                    value={newMedicine.dosage}
                    name="dosage"
                    onChange={handleChangeMedicine}
                    placeholder="Dosage"
                    label="Dosage"
                    required
                  />
                  <InputField
                    value={newMedicine.formula}
                    name="formula"
                    onChange={handleChangeMedicine}
                    placeholder="Formula"
                    label="Formula"
                    required
                  />
                  <InputField
                    value={newMedicine.genericName}
                    name="genericName"
                    onChange={handleChangeMedicine}
                    placeholder="Enter generic name"
                    label="Generic Name"
                    required
                  />
                  <InputField
                    value={newMedicine.sideEffect}
                    name="sideEffect"
                    onChange={handleChangeMedicine}
                    placeholder="Side effect of the medicine"
                    label="Side Effects"
                    required
                  />
                  <InputField
                    value={newMedicine.usage}
                    name="usage"
                    onChange={handleChangeMedicine}
                    placeholder="Usage / directions"
                    label="Side Effects"
                    required
                  />

                  <div className="flex justify-end mt-4">
                    <Button type="submit" size="large">
                      Save Details
                    </Button>
                  </div>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={onSaveCapsule}>
                <div className="flex flex-col gap-1">
                  <InputField
                    value={newCapsule.color}
                    name="color"
                    onChange={handleChangeCapsule}
                    label="Enter capsule color"
                    placeholder="Capsule Color"
                  />
                  <InputField
                    value={newCapsule.composition}
                    name="composition"
                    onChange={handleChangeCapsule}
                    label="Capsule composition"
                    placeholder="Enter capsule composition"
                    required
                  />
                  <InputField
                    value={newCapsule.packaging}
                    name="packaging"
                    onChange={handleChangeCapsule}
                    label="Packaging Type"
                    placeholder="blister packs or bottles"
                  />
                  <InputField
                    value={newCapsule.releaseProfile}
                    name="releaseProfile"
                    onChange={handleChangeCapsule}
                    label="Release Profile"
                    placeholder="Immediate, Delayed, Extended-release"
                    required
                  />
                  <InputField
                    value={newCapsule.shape}
                    name="shape"
                    onChange={handleChangeCapsule}
                    label="Capsule Shape"
                    placeholder="Capsule shape (optional)"
                  />
                  <InputField
                    value={newCapsule.size}
                    name="size"
                    onChange={handleChangeCapsule}
                    label="Capsule Size"
                    placeholder="Enter size or amount (optional)"
                  />
                  <InputField
                    value={newCapsule.storageRequirements}
                    name="storageRequirements"
                    onChange={handleChangeCapsule}
                    label="Storage Requirements"
                    placeholder="Enter Storage requirements"
                    required
                  />
                  <InputField
                    value={newCapsule.strength}
                    name="strength"
                    onChange={handleChangeCapsule}
                    label="Capsule Strength"
                    placeholder="Strength in potency"
                    required
                  />
                  <InputField
                    value={newCapsule.quantity}
                    name="quantity"
                    onChange={handleChangeCapsule}
                    placeholder="Amount in inventory"
                    label="Amount Recieved"
                    type="number"
                    required
                  />

                  <div className="flex justify-end mt-4">
                    <Button type="submit" size="large">
                      Save Capsule
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div>
              <div className="my-4">
                <Divider />
              </div>
              <div className="flex-row flex gap-3 justify-end">
                {step !== 0 && (
                  <Button
                    size="large"
                    appearance="primary"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                {step < 2 && (
                  <Button
                    size="large"
                    appearance="primary"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewCapsule;
