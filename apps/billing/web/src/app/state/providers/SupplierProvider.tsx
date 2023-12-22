import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
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
    setIsLoading(false);
    setSupplierList(data);
  }, []);

  const createSupplier = useCallback(
    async (newSupplier: ISupplier) => {
      setIsLoading(true);
      await HttpClient().post('/supplier', newSupplier);
      await getSuppliers();
      setIsLoading(false);
    },
    [getSuppliers]
  );

  const updateSupplier = useCallback(
    async (updatedSupplier: ISupplier) => {
      setIsLoading(true);
      await HttpClient().put(
        `/supplier/${updatedSupplier.id}`,
        updatedSupplier
      );
      await getSuppliers();
      setIsLoading(false);
    },
    [getSuppliers]
  );

  const deleteSupplier = useCallback(
    async (deletedSupplier: ISupplier) => {
      HttpClient().delete(`/supplier/${deletedSupplier.id}`);
      await getSuppliers();
    },
    [getSuppliers]
  );

  useEffect(() => {
    getSuppliers();
    return () => {};
  }, [getSuppliers]);

  return (
    <LoaderWrapper isLoading={isLoading}>
      <SupplierContext.Provider
        value={{
          supplierList,
          setSupplierList,
          getSuppliers,
          createSupplier,
          updateSupplier,
          deleteSupplier,
        }}
      >
        {children}
      </SupplierContext.Provider>
    </LoaderWrapper>
  );
};

export default SupplierProvider;
