import { ReactNode, useCallback, useEffect, useState } from 'react';
import { IInvoice } from '@billinglib';
import { HttpClient } from '../../utils/common';
import { InvoiceContext } from '../contexts/InvoiceContext';

interface Props {
  children?: ReactNode | ReactNode[];
}

const InvoiceProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);

  const getInvoices = useCallback(async () => {
    setIsLoading(true);
    const data = (await HttpClient().get('/invoice')).data;
    setInvoiceList(data);
    setIsLoading(false);
  }, []);

  const createInvoice = useCallback(
    async (newInvoice: IInvoice) => {
      setIsLoading(true);
      const responseData = (await HttpClient().post('/invoice', newInvoice))
        .data;
      await getInvoices();
      setIsLoading(false);
      return responseData;
    },
    [invoiceList]
  );

  const updateInvoice = useCallback(
    async (updatedInvoice: IInvoice) => {
      setIsLoading(true);
      await HttpClient().put(`/invoice/${updatedInvoice.id}`, updatedInvoice);
      await getInvoices();
    },
    [invoiceList]
  );

  const deleteInvoice = useCallback(
    async (deletedMedicine: IInvoice) => {
      setIsLoading(true);
      HttpClient().delete(`/invoice/${deletedMedicine.id}`);
      await getInvoices();
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
