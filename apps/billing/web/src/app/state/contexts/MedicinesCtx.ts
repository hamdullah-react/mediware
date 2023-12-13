/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export const MedicineListsCtx = createContext<
  [any[], React.Dispatch<React.SetStateAction<any[]>>] | []
>([]);
