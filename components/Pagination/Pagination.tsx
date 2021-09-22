import React, { FC } from 'react';
import { ErrorBoundary } from '@/components';
import { INITIAL_VALUES } from './constants';
import PaginationProvider from './PaginationProvider';

export type PaginationProps = {
  onPageChange: (page: number) => void
  currentPage: number
  pagesCount: number
  isDisabled?: boolean
};

const Pagination: FC<PaginationProps> = ({
  children,
  pagesCount,
  onPageChange,
  isDisabled = INITIAL_VALUES.isDisabled,
  currentPage = INITIAL_VALUES.currentPage,
}) => (
  <ErrorBoundary>
    <PaginationProvider
      currentPage={currentPage}
      isDisabled={isDisabled}
      pagesCount={pagesCount}
      onPageChange={onPageChange}
    >
      {children}
    </PaginationProvider>
  </ErrorBoundary>
);

export default Pagination;
