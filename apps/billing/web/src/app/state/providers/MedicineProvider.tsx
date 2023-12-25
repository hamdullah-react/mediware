import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { IMedicine } from '@billinglib';
import { HttpClient, apiCallAlertWrapper } from '../../utils/common';
import { MedicineContext } from '../contexts/MedicineContext';
import { AuthContext } from '../contexts/AuthContext';
import { useAlert } from './AlertProvider';

interface Props {
  children?: ReactNode | ReactNode[];
}

const MedicineProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { activeUser, logoutUser } = useContext(AuthContext);
  const { setAlert } = useAlert();
  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);

  const getMedicines = useCallback(async () => {
    await apiCallAlertWrapper(
      async () => {
        setIsLoading(true);
        const data = (await HttpClient(activeUser?.token).get('/medicine'))
          .data;
        setMedicineList(data);
      },
      setAlert,
      setIsLoading,
      () => {
        if (logoutUser) logoutUser();
      }
    );
  }, []);

  const createMedicine = useCallback(
    async (newMedicine: IMedicine) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          const responseData = (
            await HttpClient(activeUser?.token).post('/medicine', newMedicine)
          ).data;
          await getMedicines();
          return responseData;
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [medicineList]
  );

  const updateMedicine = useCallback(
    async (updatedMedicine: IMedicine) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).put(
            `/medicine/${updatedMedicine.id}`,
            updatedMedicine
          );
          await getMedicines();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [medicineList]
  );

  const deleteMedicine = useCallback(
    async (deletedMedicine: IMedicine) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).delete(
            `/medicine/${deletedMedicine.id}`
          );
          await getMedicines();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
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
