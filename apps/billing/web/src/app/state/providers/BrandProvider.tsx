// FIXME
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import { HttpClient, errorHandler } from '../../utils/common';
import { BrandListsCtx } from '../contexts/BrandsCtx';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';

interface Props {
  children?: ReactNode | ReactNode[];
}

const BrandProvider = ({ children }: Props) => {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBrands = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/brands')).data;
      setBrands(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      errorHandler({ error });
    }
  };

  const deleteBrand = async (brand: any) => {
    try {
      if (brand.id) {
        if (confirm('Are your sure your you want to delete')) {
          setIsLoading(true);
          const deleted = (await HttpClient().delete(`/brands/${brand.id}`))
            .data;
          console.log(deleted);
          const data = (await HttpClient().get('/brands')).data;
          console.log(data);
          setBrands(data.data);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      errorHandler({ error });
    }
  };

  useEffect(() => {
    getBrands()
      .then((_) => {})
      .catch((err) => {
        errorHandler({ err });
      });
  }, []);

  return (
    <BrandListsCtx.Provider value={[brands, setBrands, getBrands, deleteBrand]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </BrandListsCtx.Provider>
  );
};

export default BrandProvider;
