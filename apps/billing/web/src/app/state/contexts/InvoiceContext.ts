import { IInvoice } from '@billinglib';
import { Dispatch, SetStateAction, createContext } from 'react';

export const InvoiceContext = createContext<{
  invoiceList?: IInvoice[];
  setInvoiceList?: Dispatch<SetStateAction<IInvoice[]>>;
  getInvoices?: () => Promise<void>;
  createInvoice?: (_: IInvoice) => Promise<void>;
  updateInvoice?: (_: IInvoice) => Promise<void>;
  deleteInvoice?: (_: IInvoice) => Promise<void>;
  isLoading?: boolean;
}>({});
