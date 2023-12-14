// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
import { InjectionListsCtx } from '../contexts/InjectionsCtx';
interface Props {
  children?: ReactNode | ReactNode[];
}

const InjectionsProvider = ({ children }: Props) => {
  const [injections, setInjections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines/injections')).data;
      setInjections(data.data);
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
    <InjectionListsCtx.Provider value={[injections, setInjections, getData]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </InjectionListsCtx.Provider>
  );
};

export default InjectionsProvider;
