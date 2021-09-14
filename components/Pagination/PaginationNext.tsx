import React, { FC, useMemo, useContext, MouseEvent } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import { PaginationContext } from './PaginationProvider';

export const PaginationNext: FC<ButtonProps> = ({
  children,
  isDisabled: isDisabledProp,
  ...buttonProps
}) => {
  const { actions, state } = useContext(PaginationContext);
  const { changePage } = actions;
  const { currentPage, pagesCount, isDisabled: isDisabledGlobal } = state;

  const isLast = useMemo(
    () => currentPage > pagesCount - 1,
    [currentPage, pagesCount],
  );

  const isDisabled = useMemo(
    () => isLast || (isDisabledProp ?? isDisabledGlobal),
    [isLast, isDisabledProp, isDisabledGlobal],
  );

  const allProps = useMemo(
    () => ({
      ...buttonProps,
      isDisabled,
    }),
    [buttonProps, isDisabled],
  );

  const handleNextClick = (): void => {
    if (!isLast) changePage(currentPage + 1);
  };

  const getNextProps = ({
    onClick,
    isDisabled: isNextDisabled,
    ...props
  }: ButtonProps): ButtonProps => ({
    ...props,
    'aria-label': 'Next page',
    'aria-disabled': isNextDisabled,
    isDisabled: isNextDisabled,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      if (!isNextDisabled) {
        onClick?.(event);
      }

      handleNextClick();
    },
  });

  return (
    <Button className="pagination-next" {...getNextProps(allProps)}>
      {children}
    </Button>
  );
};
