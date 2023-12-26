import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { IInvoice } from '@billinglib';
import { HttpClient, apiCallAlertWrapper } from '../../utils/common';
import { InvoiceContext } from '../contexts/InvoiceContext';
import { AuthContext } from '../contexts/AuthContext';
import { useAlert } from './AlertProvider';
import { MedicineContext } from '../contexts/MedicineContext';

interface Props {
  children?: ReactNode | ReactNode[];
}

const InvoiceProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);
  const { activeUser, logoutUser } = useContext(AuthContext);
  const { getMedicines } = useContext(MedicineContext);
  const { setAlert } = useAlert();

  const getInvoices = useCallback(async () => {
    await apiCallAlertWrapper(
      async () => {
        setIsLoading(true);
        const data = (await HttpClient(activeUser?.token).get('/invoice')).data;
        if (getMedicines) {
          await getMedicines();
        }
        setInvoiceList(data);
        setIsLoading(false);
      },
      setAlert,
      setIsLoading,
      () => {
        if (logoutUser) logoutUser();
      }
    );
  }, []);

  const createInvoice = useCallback(
    async (newInvoice: IInvoice) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          const responseData = (
            await HttpClient(activeUser?.token).post('/invoice', newInvoice)
          ).data;
          await getInvoices();
          setIsLoading(false);
          return responseData;
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [invoiceList]
  );

  const updateInvoice = useCallback(
    async (updatedInvoice: IInvoice) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).put(
            `/invoice/${updatedInvoice.id}`,
            updatedInvoice
          );
          await getInvoices();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [invoiceList]
  );

  const deleteInvoice = useCallback(
    async (deletedMedicine: IInvoice) => {
      await apiCallAlertWrapper(
        async () => {
          setIsLoading(true);
          await HttpClient(activeUser?.token).delete(
            `/invoice/${deletedMedicine.id}`
          );
          await getInvoices();
        },
        setAlert,
        setIsLoading,
        () => {
          if (logoutUser) logoutUser();
        }
      );
    },
    [invoiceList]
  );

  useEffect(() => {
    getInvoices().then((e) => {});
    return () => {};
  }, [getInvoices]);

  return (
    <InvoiceContext.Provider
      value={{
        invoiceList,
        setInvoiceList,
        createInvoice,
        getInvoices,
        updateInvoice,
        deleteInvoice,
        isLoading,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceProvider;
