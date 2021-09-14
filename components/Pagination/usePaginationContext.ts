import { useContext } from 'react';

// lib
import {
  PaginationContext,
  PaginationContextValues,
} from './PaginationProvider';

export const usePaginationContext = (): PaginationContextValues => {
  return useContext(PaginationContext);
};
