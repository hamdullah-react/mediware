/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export const InhalerListsCtx = createContext<
  [any[], React.Dispatch<React.SetStateAction<any[]>>, () => Promise<void>] | []
>([]);
