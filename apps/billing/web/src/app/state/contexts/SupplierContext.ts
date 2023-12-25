import { ISupplier } from '@billinglib';
import { createContext } from 'react';

export const SupplierContext = createContext<{
  supplierList?: ISupplier[];
  setSupplierList?: React.Dispatch<React.SetStateAction<ISupplier[]>>;
  getSuppliers?: () => Promise<void>;
  createSupplier?: (_: ISupplier) => Promise<void>;
  updateSupplier?: (_: ISupplier) => Promise<void>;
  deleteSupplier?: (_: ISupplier) => Promise<void>;
  isLoading?: boolean;
}>({});
