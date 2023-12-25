import { IMedicine } from '@billinglib';
import { createContext } from 'react';

export const MedicineContext = createContext<{
  medicineList?: IMedicine[];
  setMedicineList?: React.Dispatch<React.SetStateAction<IMedicine[]>>;
  getMedicines?: () => Promise<void>;
  createMedicine?: (_: IMedicine) => Promise<void>;
  updateMedicine?: (_: IMedicine) => Promise<void>;
  deleteMedicine?: (_: IMedicine) => Promise<void>;
  isLoading?: boolean;
}>({});
