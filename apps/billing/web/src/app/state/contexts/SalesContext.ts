import { ISaleInvoice } from '@billinglib';
import React, { createContext } from 'react';

export const SalesContext = createContext<{
  saleInvoiceList?: ISaleInvoice[];
  setSaleInvoiceList?: React.Dispatch<React.SetStateAction<ISaleInvoice[]>>;
  getSaleInvoices?: () => Promise<void>;
  createSaleInvoice?: (_: ISaleInvoice) => Promise<void>;
  updateSaleInvoice?: (_: ISaleInvoice) => Promise<void>;
  deleteSaleInvoice?: (_: ISaleInvoice) => Promise<void>;
  isLoading?: boolean;
}>({});
