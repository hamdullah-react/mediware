// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
import { InhalerListsCtx } from '../contexts/InhalersCtx';
interface Props {
  children?: ReactNode | ReactNode[];
}

const InhalersProvider = ({ children }: Props) => {
  const [inhalers, setInhalers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines/inhalers')).data;
      setInhalers(data.data);
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
    <InhalerListsCtx.Provider value={[inhalers, setInhalers, getData]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </InhalerListsCtx.Provider>
  );
};

export default InhalersProvider;
