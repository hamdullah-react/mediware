import { IMedicine } from '@billinglib';
import { createContext } from 'react';

export const MedicineContext = createContext<{
  medicineList?: IMedicine[];
  setMedicineList?: React.Dispatch<React.SetStateAction<IMedicine[]>>;
  getMedicines?: () => Promise<void>;
  createMedicine?: (newMedicine: IMedicine) => Promise<void>;
  updateMedicine?: (updatedMedicine: IMedicine) => Promise<void>;
  deleteMedicine?: (updatedMedicine: IMedicine) => Promise<void>;
}>({});
