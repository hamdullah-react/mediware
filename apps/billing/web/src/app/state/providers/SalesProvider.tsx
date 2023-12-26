import React, { ReactNode, useState } from 'react';
import { SalesContext } from '../contexts/SalesContext';

interface Props {
  children: ReactNode | ReactNode[];
}

const SalesProvider = ({ children }: Props) => {
  const [sales, setSales] = useState([]);

  return (
    <SalesContext.Provider value={[sales, setSales]}>
      {children}
    </SalesContext.Provider>
  );
};

export default SalesProvider;
