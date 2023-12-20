import { ISupplier } from '@billinglib';
import { createContext } from 'react';

export const SupplierListCtx = createContext<{
  supplierList?: ISupplier[];
  setSupplierList?: React.Dispatch<React.SetStateAction<ISupplier[]>>;
  getSuppliers?: () => Promise<void>;
  createSupplier?: (newSupploer: ISupplier) => Promise<void>;
  updateSupplier?: (updatedSupplier: ISupplier) => Promise<void>;
  deleteSupplier?: (updatedSupplier: ISupplier) => Promise<void>;
}>({});
