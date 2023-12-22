import { ReactNode, useCallback, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
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
    setIsLoading(false);
    setInvoiceList(data);
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
    [getInvoices]
  );

  const updateInvoice = useCallback(
    async (updatedInvoice: IInvoice) => {
      setIsLoading(true);
      await HttpClient().put(`/invoice/${updatedInvoice.id}`, updatedInvoice);
      await getInvoices();
      setIsLoading(false);
    },
    [getInvoices]
  );

  const deleteInvoice = useCallback(
    async (deletedMedicine: IInvoice) => {
      HttpClient().delete(`/invoice/${deletedMedicine.id}`);
      await getInvoices();
    },
    [getInvoices]
  );

  useEffect(() => {
    getInvoices().then((e) => {});
    return () => {};
  }, [getInvoices]);

  return (
    <div>
      <LoaderWrapper isLoading={isLoading}>
        <InvoiceContext.Provider
          value={{
            invoiceList,
            setInvoiceList,
            createInvoice,
            getInvoices,
            updateInvoice,
            deleteInvoice,
          }}
        >
          {children}
        </InvoiceContext.Provider>
      </LoaderWrapper>
    </div>
  );
};

export default InvoiceProvider;
