import { useContext } from 'react';
import { PaginationContext } from './PaginationProvider';
import type { PaginationContextValues } from './PaginationProvider';

const usePaginationContext = (): PaginationContextValues => {
  return useContext(PaginationContext);
};

export default usePaginationContext;
