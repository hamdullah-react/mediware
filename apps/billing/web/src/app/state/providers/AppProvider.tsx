import { ReactNode } from 'react';
import SupplierProvider from './SupplierProvider';
import MedicineProvider from './MedicineProvider';
import InvoiceProvider from './InvoiceProvider';
import SalesProvider from './SalesProvider';

interface Props {
  children: ReactNode | ReactNode[];
}

const AppProvider = ({ children }: Props) => {
  return (
    <SupplierProvider>
      <MedicineProvider>
        <InvoiceProvider>
          <SalesProvider>{children}</SalesProvider>
        </InvoiceProvider>
      </MedicineProvider>
    </SupplierProvider>
  );
};

export default AppProvider;
