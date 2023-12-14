import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import InputField from '../../shared/molecules/InputField';
import { Button, Spinner } from '@fluentui/react-components';
import Modal from '../../shared/organisms/Modal';
import { HttpClient, errorHandler } from '../../utils/common';
import { BrandListsCtx } from '../../state/contexts/BrandsCtx';

interface Props {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const NewBrand = ({ setIsOpen, isOpen = false }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newBrand, setNewBrand] = useState({
    address: '',
    email: '',
    name: '',
    telephone: '',
  });

  const [, , getBrands] = useContext(BrandListsCtx);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setNewBrand({
        ...newBrand,
        [ev.target.name]: ev.target.value,
      });
    },
    [newBrand]
  );

  const submitNewBrand = useCallback(async () => {
    try {
      const response = (await HttpClient().post('/brands', newBrand)).data;
      return response.data;
    } catch (error) {
      errorHandler({ error }, false);
    }
  }, [newBrand]);

  const onSubmitting = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      setIsLoading(true);
      event.preventDefault();
      submitNewBrand()
        .then((_) => {
          if (getBrands) {
            getBrands()
              .then((_) => {})
              .catch((err) => {
                errorHandler({ err });
              });
          }
          setIsLoading(false);
          setIsOpen(false);
        })
        .catch((err) => {
          errorHandler({ err }, false);
          setIsOpen(false);
          setIsLoading(false);
        });
    },
    [getBrands, setIsOpen, submitNewBrand]
  );

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="New Brand"
      hideClose={isLoading}
    >
      <div>
        {isLoading ? (
          <div className="py-10">
            <Spinner label={'Please Wait'} labelPosition="below" />
          </div>
        ) : (
          <form className="flex flex-col gap-2" onSubmit={onSubmitting}>
            <InputField
              name="name"
              value={newBrand.name}
              onChange={handleChange}
              label="Brand Name"
              placeholder="Brand Name or Producer"
              required
            />
            <InputField
              type="tel"
              name="telephone"
              value={newBrand.telephone}
              onChange={handleChange}
              label="Contact Number"
              placeholder="Telephone or Fax"
              required
            />
            <InputField
              type="email"
              name="email"
              value={newBrand.email}
              onChange={handleChange}
              label="Email Address"
              placeholder="hello@company.com"
              required
            />
            <InputField
              name="address"
              value={newBrand.address}
              onChange={handleChange}
              label="Address"
              placeholder="Akbar Margalla, E-11/3"
              required
            />
            <div className="h-2" />
            <Button type="submit" size="large" appearance="primary">
              Insert Brand
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default NewBrand;
