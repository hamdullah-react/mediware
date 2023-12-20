import { Spinner } from '@fluentui/react-components';
import React, { ReactNode } from 'react';

interface Props {
  isLoading?: boolean;
  children?: ReactNode | ReactNode[];
}

const LoaderWrapper = ({ children, isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Spinner label={'Loading'} labelPosition="after" appearance="primary" />
      </div>
    );
  } else {
    return children;
  }
};

export default LoaderWrapper;
