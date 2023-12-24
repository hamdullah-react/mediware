import { ReactNode, useCallback, useEffect, useState } from 'react';
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
    setMedicineList(data);
    setIsLoading(false);
  }, []);

  const createMedicine = useCallback(
    async (newMedicine: IMedicine) => {
      setIsLoading(true);
      const responseData = (await HttpClient().post('/medicine', newMedicine))
        .data;
      await getMedicines();
      return responseData;
    },
    [medicineList]
  );

  const updateMedicine = useCallback(
    async (updatedMedicine: IMedicine) => {
      setIsLoading(true);
      await HttpClient().put(
        `/medicine/${updatedMedicine.id}`,
        updatedMedicine
      );
      await getMedicines();
    },
    [medicineList]
  );

  const deleteMedicine = useCallback(
    async (deletedMedicine: IMedicine) => {
      setIsLoading(true);
      await HttpClient().delete(`/medicine/${deletedMedicine.id}`);
      await getMedicines();
    },
    [medicineList]
  );

  useEffect(() => {
    getMedicines().then(() => {});
    return () => {};
  }, [getMedicines]);

  return (
    <MedicineContext.Provider
      value={{
        medicineList,
        setMedicineList,
        getMedicines,
        createMedicine,
        updateMedicine,
        deleteMedicine,
        isLoading,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export default MedicineProvider;
