import React, { FC } from 'react';
import { ErrorBoundary } from '@/components';
import { PaginationProvider } from './PaginationProvider';
import { INITIAL_VALUES } from './constants';

export type PaginationProps = {
  onPageChange: (page: number) => void
  currentPage: number
  pagesCount: number
  isDisabled?: boolean
};

export const Pagination: FC<PaginationProps> = ({
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
