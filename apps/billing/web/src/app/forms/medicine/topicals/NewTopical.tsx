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
import { BrandListsCtx } from '../../../state/contexts/BrandsCtx';
import Modal from '../../../shared/organisms/Modal';
import InputField from '../../../shared/molecules/InputField';
import NewBrand from '../NewBrand';
import clsx from 'clsx';
import { HttpClient, errorHandler } from '../../../utils/common';
import { useNavigate } from 'react-router-dom';
import { TopicalsListsCtx } from '../../../state/contexts/TopicalsCtx';

interface Props {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const NewTopicals = ({ setIsOpen, isOpen = false }: Props) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [brands] = useContext(BrandListsCtx);
  const [step, setStep] = useState(0);
  const [topicalsBrand, setTopicalsBrand] = useState<any>({});
  const [newMedicine, setNewMedicine] = useState({
    dosage: '',
    formula: '',
    genericName: '',
    sideEffect: '',
    usage: '',
    expirey: '',
    brandId: null,
  });
  const [newTopicals, setNewTopicals] = useState({
    storageConditions: '',
    quantity: '',
    medicineId: -1,
  });
  const [, , getDrops] = useContext(TopicalsListsCtx);

  const handleChangeMedicine = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setNewMedicine({
        ...newMedicine,
        [ev.target.name]: ev.target.value,
      });
    },
    [newMedicine]
  );

  const handleChangeDrops = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setNewTopicals({
        ...newTopicals,
        [ev.target.name]: ev.target.value,
      });
    },
    [newTopicals]
  );

  const onSaveMedicine = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (topicalsBrand?.id) {
          setIsLoading(true);
          const response = (
            await HttpClient().post('/medicines', {
              ...newMedicine,
              brandId: topicalsBrand.id,
            })
          ).data;

          setNewTopicals({
            ...newTopicals,
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
    [topicalsBrand.id, newTopicals, newMedicine, step]
  );

  const onSaveTopicals = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (newTopicals.medicineId !== -1) {
          setIsLoading(true);
          await HttpClient().post('/medicines/topicals', newTopicals);
          if (getDrops) {
            await getDrops();
          }
          setIsOpen(false);
          setAddingMedicine(false);
          setIsLoading(false);
          navigate('/medicines/topicals');
        } else {
          alert('Unfinished or unsaved details on previous page');
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        errorHandler({ error });
      }
    },
    [getDrops, navigate, newTopicals, setIsOpen]
  );

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="New Drops"
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
                <NewBrand
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
                          setTopicalsBrand(brand);
                          setNewBrandName(brand.name);
                          setStep(step + 1);
                        }}
                        className={clsx([
                          'cursor-pointer p-2 px-3 rounded-lg hover:bg-gray-200',
                          'active:bg-gray-300 active:scale-95 transition-all duration-200',
                          brand.id === topicalsBrand?.id &&
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
                    label="Usage"
                    required
                  />
                  <InputField
                    value={newMedicine.expirey}
                    name="expirey"
                    type="date"
                    onChange={handleChangeMedicine}
                    placeholder="Expirey"
                    label="Expirey"
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
              <form onSubmit={onSaveTopicals}>
                <div className="flex flex-col gap-1">
                  <InputField
                    value={newTopicals.quantity}
                    name="quantity"
                    onChange={handleChangeDrops}
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                  />
                  <InputField
                    value={newTopicals.storageConditions}
                    name="storageConditions"
                    onChange={handleChangeDrops}
                    label="Storage Conditions"
                    placeholder="Enter storage requirements"
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

export default NewTopicals;
