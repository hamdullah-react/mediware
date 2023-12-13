// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
import { SyrupListsCtx } from '../contexts/SyrupCtx';
interface Props {
  children?: ReactNode | ReactNode[];
}

const SyrupsProvider = ({ children }: Props) => {
  const [syrups, setSyrups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines/syrups')).data;
      setSyrups(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      errorHandler({ error });
    }
  };

  useEffect(() => {
    getData()
      .then((_) => {})
      .catch((err) => {
        errorHandler({ err });
      });
  }, []);

  return (
    <SyrupListsCtx.Provider value={[syrups, setSyrups, getData]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </SyrupListsCtx.Provider>
  );
};

export default SyrupsProvider;
