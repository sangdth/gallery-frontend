import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const { children } = props;
  
  const handleError = () => {
    // console.log('############# info: ', info);
    // console.log('############# error: ', error);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
