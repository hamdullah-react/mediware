// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
import { DropsListsCtx } from '../contexts/DropsCtx';
interface Props {
  children?: ReactNode | ReactNode[];
}

const DropsProvider = ({ children }: Props) => {
  const [drops, setDrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines/drops')).data;
      setDrops(data.data);
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
    <DropsListsCtx.Provider value={[drops, setDrops, getData]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </DropsListsCtx.Provider>
  );
};

export default DropsProvider;
