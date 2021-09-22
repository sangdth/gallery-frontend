import React, { FC, MouseEvent, useMemo } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import usePaginationContext from './usePaginationContext';

const PaginationPrevious: FC<ButtonProps> = ({
  children,
  isDisabled: isDisabledProp,
  ...buttonProps
}) => {
  const { actions, state } = usePaginationContext();
  const { changePage } = actions;

  const { currentPage, isDisabled: isDisabledGlobal } = state;

  const isFirst = useMemo(() => currentPage === 1, [currentPage]);
  const isDisabled = useMemo(
    () => isFirst || (isDisabledProp ?? isDisabledGlobal),
    [isFirst, isDisabledProp, isDisabledGlobal],
  );
  const allProps = useMemo(
    () => ({
      ...buttonProps,
      isDisabled,
    }),
    [buttonProps, isDisabled],
  );

  const handlePreviousClick = (): void => {
    if (!isFirst) changePage(currentPage - 1);
  };

  const getPreviousProps = ({
    onClick,
    isDisabled: isPreviousDisabled,
    ...props
  }: ButtonProps): ButtonProps => ({
    ...props,
    'aria-label': 'Previous page',
    'aria-disabled': isPreviousDisabled,
    isDisabled: isPreviousDisabled,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onClick?.(event);
      }

      handlePreviousClick();
    },
  });

  return (
    <Button
      className="pagination-previous"
      variant="ghost"
      {...getPreviousProps(allProps)}
    >
      {children}
    </Button>
  );
};

export default PaginationPrevious;
