import { ReactNode, useCallback, useEffect, useState } from 'react';
import { ISupplier } from '@billinglib';
import { SupplierContext } from '../contexts/SupplierContext';
import { HttpClient } from '../../utils/common';

interface Props {
  children?: ReactNode | ReactNode[];
}

const SupplierProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);

  const getSuppliers = useCallback(async () => {
    setIsLoading(true);
    const data = (await HttpClient().get('/supplier')).data;
    setSupplierList(data);
    setIsLoading(false);
  }, [supplierList]);

  const createSupplier = useCallback(
    async (newSupplier: ISupplier) => {
      setIsLoading(true);
      await HttpClient().post('/supplier', newSupplier);
      await getSuppliers();
    },
    [supplierList]
  );

  const updateSupplier = useCallback(
    async (updatedSupplier: ISupplier) => {
      setIsLoading(true);
      await HttpClient().put(
        `/supplier/${updatedSupplier.id}`,
        updatedSupplier
      );
      await getSuppliers();
    },
    [supplierList]
  );

  const deleteSupplier = useCallback(
    async (deletedSupplier: ISupplier) => {
      setIsLoading(true);
      await HttpClient().delete(`/supplier/${deletedSupplier.id}`);
      await getSuppliers();
    },
    [supplierList]
  );

  useEffect(() => {
    getSuppliers().then(() => {});
    return () => {};
  }, []);

  return (
    <SupplierContext.Provider
      value={{
        supplierList,
        setSupplierList,
        getSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        isLoading,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export default SupplierProvider;
