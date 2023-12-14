/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export const InjectionListsCtx = createContext<
  [any[], React.Dispatch<React.SetStateAction<any[]>>, () => Promise<void>] | []
>([]);
