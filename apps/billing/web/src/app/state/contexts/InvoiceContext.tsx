import { IInvoice } from '@billinglib';
import { Dispatch, SetStateAction, createContext } from 'react';

export const InvoiceContext = createContext<{
  invoiceList?: IInvoice[];
  setInvoiceList?: Dispatch<SetStateAction<IInvoice[]>>;
  getInvoices?: () => Promise<void>;
  createInvoice?: (newInvoice: IInvoice) => Promise<void>;
  updateInvoice?: (updatedInvoice: IInvoice) => Promise<void>;
  deleteInvoice?: (updatedInvoice: IInvoice) => Promise<void>;
}>({});
