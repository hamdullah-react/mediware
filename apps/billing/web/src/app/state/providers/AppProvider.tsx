import React, { ReactNode } from 'react';
import SupplierProvider from './SupplierProvider';
import MedicineProvider from './MedicineProvider';
import InvoiceProvider from './InvoiceProvider';

interface Props {
  children: ReactNode | ReactNode[];
}

const AppProvider = ({ children }: Props) => {
  return (
    <SupplierProvider>
      <MedicineProvider>
        <InvoiceProvider>{children}</InvoiceProvider>
      </MedicineProvider>
    </SupplierProvider>
  );
};

export default AppProvider;
