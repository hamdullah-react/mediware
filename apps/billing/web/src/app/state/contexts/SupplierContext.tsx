import { ISupplier } from '@billinglib';
import { createContext } from 'react';

export const SupplierContext = createContext<{
  supplierList?: ISupplier[];
  setSupplierList?: React.Dispatch<React.SetStateAction<ISupplier[]>>;
  getSuppliers?: () => Promise<void>;
  createSupplier?: (newSupplier: ISupplier) => Promise<void>;
  updateSupplier?: (updatedSupplier: ISupplier) => Promise<void>;
  deleteSupplier?: (updatedSupplier: ISupplier) => Promise<void>;
}>({});
