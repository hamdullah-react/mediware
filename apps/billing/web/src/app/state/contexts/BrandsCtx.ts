/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';

export const BrandListsCtx = createContext<
  | [
      any[],
      React.Dispatch<React.SetStateAction<any[]>>,
      () => Promise<void>,
      (brand: any) => Promise<void>
    ]
  | []
>([]);
