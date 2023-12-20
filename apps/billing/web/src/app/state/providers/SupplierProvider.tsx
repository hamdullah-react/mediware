import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { ISupplier } from '@billinglib';
import { SupplierListCtx } from '../contexts/SupplierContext';

interface Props {
  children?: ReactNode | ReactNode[];
}

const SupplierProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [supplierList, setSupplierList] = useState<ISupplier[]>([
    {
      name: 'abubakar',
      addressLine1: 'hah 1',
      addressLine2: ' haha 2',
      city: 'sialkot',
      emails: 'abubakar@gmail.com',
      licenseNumber: '',
      NTN: '',
      STN: '',
      telephones: '',
      TNNumber: '',
      TRNNumber: '',
      whatsapps: '',
    },
    {
      name: 'abubakar2',
      addressLine1: 'hah 1',
      addressLine2: ' haha 2',
      city: 'sialkot',
      emails: 'abubakar@gmail.com',
      licenseNumber: '',
      NTN: '123456',
      STN: '',
      telephones: '',
      TNNumber: '',
      TRNNumber: '',
      whatsapps: '',
    },
    {
      name: 'abubakar3',
      addressLine1: 'hah 1',
      addressLine2: ' haha 2',
      city: 'sialkot',
      emails: 'abubakar@gmail.com',
      licenseNumber: '',
      NTN: '',
      STN: '',
      telephones: '',
      TNNumber: '',
      TRNNumber: '',
      whatsapps: '',
    },
  ]);

  const getSuppliers = useCallback(async () => {
    console.log(supplierList);
  }, [supplierList]);

  const createSupplier = useCallback(
    async (newSupplier: ISupplier) => {
      console.log(supplierList);
    },
    [supplierList]
  );

  const updateSupplier = useCallback(
    async (updatedSupplier: ISupplier) => {
      console.log(supplierList);
    },
    [supplierList]
  );

  const deleteSupplier = useCallback(
    async (updatedSupplier: ISupplier) => {
      console.log(supplierList);
    },
    [supplierList]
  );

  useEffect(() => {
    // load suppliers here
    getSuppliers();
    setIsLoading(false);
    return () => {};
  }, [getSuppliers, supplierList]);

  return (
    <LoaderWrapper isLoading={isLoading}>
      <SupplierListCtx.Provider
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
      </SupplierListCtx.Provider>
    </LoaderWrapper>
  );
};

export default SupplierProvider;
