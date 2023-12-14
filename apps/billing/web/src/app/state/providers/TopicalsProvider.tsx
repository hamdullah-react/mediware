// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
import { TopicalsListsCtx } from '../contexts/TopicalsCtx';
interface Props {
  children?: ReactNode | ReactNode[];
}

const TopicalsProvider = ({ children }: Props) => {
  const [topicals, setTopicals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines/topicals')).data;
      setTopicals(data.data);
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
    <TopicalsListsCtx.Provider value={[topicals, setTopicals, getData]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </TopicalsListsCtx.Provider>
  );
};

export default TopicalsProvider;
