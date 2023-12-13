// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from 'react';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
import { CapsuleListsCtx } from '../contexts/CapsulesCtx';
interface Props {
  children?: ReactNode | ReactNode[];
}

const CapsulesProvider = ({ children }: Props) => {
  const [capsules, setCapsules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines/capsules')).data;
      setCapsules(data.data);
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
    <CapsuleListsCtx.Provider value={[capsules, setCapsules, getData]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </CapsuleListsCtx.Provider>
  );
};

export default CapsulesProvider;
