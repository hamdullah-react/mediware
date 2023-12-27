import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SalesContext } from '../contexts/SalesContext';
import { ISaleInvoice } from '@billinglib';
import { HttpClient, apiCallAlertWrapper } from '../../utils/common';
import { AuthContext } from '../contexts/AuthContext';
import { useAlert } from './AlertProvider';
import { MedicineContext } from '../contexts/MedicineContext';

interface Props {
  children: ReactNode | ReactNode[];
}

const SalesProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [saleInvoiceList, setSaleInvoiceList] = useState<ISaleInvoice[]>([]);
  const { activeUser, logoutUser } = useContext(AuthContext);
  const { getMedicines } = useContext(MedicineContext);
  const { setAlert } = useAlert();

  const getSaleInvoices = useCallback(async () => {
    await apiCallAlertWrapper(
      async () => {
        setIsLoading(true);
        const data = (await HttpClient(activeUser?.token).get('/sales')).data;
        setSaleInvoiceList(data);
        if (getMedicines) {
          await getMedicines();
        }
      },
      setAlert,
      setIsLoading,
      () => {
        if (logoutUser) logoutUser();
      }
    );
  }, []);

  const createSaleInvoice = useCallback(
    async (newSaleInvoice: ISaleInvoice) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).post('/sales', newSaleInvoice);
          await getSaleInvoices();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [saleInvoiceList]
  );

  const updateSaleInvoice = useCallback(
    async (updatedSaleInvoice: ISaleInvoice) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).put(
            `/sales/${updatedSaleInvoice.id}`,
            updatedSaleInvoice
          );
          await getSaleInvoices();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [saleInvoiceList]
  );

  const deleteSaleInvoice = useCallback(
    async (deletedSaleInvoice: ISaleInvoice) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).delete(
            `/sales/${deletedSaleInvoice.id}`
          );
          await getSaleInvoices();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [saleInvoiceList]
  );

  useEffect(() => {
    getSaleInvoices().then(() => {});
    return () => {};
  }, []);

  return (
    <SalesContext.Provider
      value={{
        saleInvoiceList,
        setSaleInvoiceList,
        getSaleInvoices,
        createSaleInvoice,
        updateSaleInvoice,
        deleteSaleInvoice,
        isLoading,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export default SalesProvider;
