import React, { ReactNode } from 'react';
import SupplierProvider from './SupplierProvider';

interface Props {
  children: ReactNode | ReactNode[];
}

const AppProvider = ({ children }: Props) => {
  return <SupplierProvider>{children}</SupplierProvider>;
};

export default AppProvider;
