import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { ISupplier } from '@billinglib';
import { SupplierContext } from '../contexts/SupplierContext';
import { HttpClient, apiCallAlertWrapper } from '../../utils/common';
import { AuthContext } from '../contexts/AuthContext';
import { useAlert } from './AlertProvider';

interface Props {
  children?: ReactNode | ReactNode[];
}

const SupplierProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const { activeUser, logoutUser } = useContext(AuthContext);
  const { setAlert } = useAlert();

  const getSuppliers = useCallback(async () => {
    await apiCallAlertWrapper(
      async () => {
        setIsLoading(true);
        const data = (await HttpClient(activeUser?.token).get('/supplier'))
          .data;
        setSupplierList(data);
      },
      setAlert,
      setIsLoading,
      () => {
        if (logoutUser) logoutUser();
      }
    );
  }, []);

  const createSupplier = useCallback(
    async (newSupplier: ISupplier) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).post('/supplier', newSupplier);
          await getSuppliers();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [supplierList]
  );

  const updateSupplier = useCallback(
    async (updatedSupplier: ISupplier) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).put(
            `/supplier/${updatedSupplier.id}`,
            updatedSupplier
          );
          await getSuppliers();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [supplierList]
  );

  const deleteSupplier = useCallback(
    async (deletedSupplier: ISupplier) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).delete(
            `/supplier/${deletedSupplier.id}`
          );
          await getSuppliers();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [supplierList]
  );

  useEffect(() => {
    getSuppliers().then(() => {});
    return () => {};
  }, []);

  return (
    <SupplierContext.Provider
      value={{
        supplierList,
        setSupplierList,
        getSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        isLoading,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export default SupplierProvider;
