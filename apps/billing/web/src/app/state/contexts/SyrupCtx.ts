/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export const SyrupListsCtx = createContext<
  [any[], React.Dispatch<React.SetStateAction<any[]>>, () => Promise<void>] | []
>([]);
