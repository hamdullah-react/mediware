import { ReactNode, useCallback, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { IMedicine } from '@billinglib';
import { HttpClient } from '../../utils/common';
import { MedicineContext } from '../contexts/MedicineContext';

interface Props {
  children?: ReactNode | ReactNode[];
}

const MedicineProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);

  const getMedicines = useCallback(async () => {
    setIsLoading(true);
    const data = (await HttpClient().get('/medicine')).data;
    setIsLoading(false);
    setMedicineList(data);
  }, []);

  const createMedicine = useCallback(
    async (newMedicine: IMedicine) => {
      setIsLoading(true);
      const responseData = (await HttpClient().post('/medicine', newMedicine))
        .data;
      await getMedicines();
      setIsLoading(false);
      return responseData;
    },
    [getMedicines]
  );

  const updateMedicine = useCallback(
    async (updatedMedicine: IMedicine) => {
      setIsLoading(true);
      await HttpClient().put(
        `/medicine/${updatedMedicine.id}`,
        updatedMedicine
      );
      await getMedicines();
      setIsLoading(false);
    },
    [getMedicines]
  );

  const deleteMedicine = useCallback(
    async (deletedMedicine: IMedicine) => {
      HttpClient().delete(`/medicine/${deletedMedicine.id}`);
      await getMedicines();
    },
    [getMedicines]
  );

  useEffect(() => {
    getMedicines();
    return () => {};
  }, [getMedicines]);

  return (
    <LoaderWrapper isLoading={isLoading}>
      <MedicineContext.Provider
        value={{
          medicineList,
          setMedicineList,
          getMedicines,
          createMedicine,
          updateMedicine,
          deleteMedicine,
        }}
      >
        {children}
      </MedicineContext.Provider>
    </LoaderWrapper>
  );
};

export default MedicineProvider;
