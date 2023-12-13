// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from 'react';
import { MedicineListsCtx } from '../contexts/MedicinesCtx';
import LoaderWrapper from '../../shared/molecules/LoaderWrapper';
import { HttpClient, errorHandler } from '../../utils/common';
interface Props {
  children?: ReactNode | ReactNode[];
}

const MedicinesProvider = ({ children }: Props) => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMedicines = async () => {
    try {
      setIsLoading(true);
      const data = (await HttpClient().get('/medicines')).data;
      setMedicines(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      errorHandler({ error });
    }
  };

  useEffect(() => {
    getMedicines()
      .then((_) => {})
      .catch((err) => {
        errorHandler({ err });
      });
  }, []);

  return (
    <MedicineListsCtx.Provider value={[medicines, setMedicines]}>
      <LoaderWrapper isLoading={isLoading}>{children}</LoaderWrapper>
    </MedicineListsCtx.Provider>
  );
};

export default MedicinesProvider;
