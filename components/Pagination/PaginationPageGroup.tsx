import React, {
  FC,
  ReactElement,
  cloneElement,
  Children,
  isValidElement,
} from 'react';
import { Stack, StackProps } from '@chakra-ui/react';

export type PageGroupProps = {
  separator?: ReactElement
};

const PaginationPageGroup: FC<PageGroupProps & StackProps> = ({
  children,
  separator,
  ...stackProps
}) => {
  // TODO: implement getPageGroupProp

  return (
    <Stack
      isInline
      as="ol"
      className="pagination-page-group"
      spacing={1}
      {...stackProps}
    >
      {Children.map(
        children,
        (child) => isValidElement(child) ? cloneElement(child, { separator }) : null,
      )}
    </Stack>
  );
};

export default PaginationPageGroup;
