import React from 'react';
import { Box } from '@chakra-ui/react';

type GridItemProps = {
  children?: React.ReactNode;
  style?: any;
  className?: string;
};

export const GridItem = React.forwardRef(
  (props: GridItemProps, ref: any) => {
    const {
      children,
      style,
      className,
      ...restProps
    } = props;

    return (
      <Box
        style={{
          borderWidth: 1,
          borderColor: '#C3C3C3',
          ...style,
        }}
        className={className}
        ref={ref}
        {...restProps}
      >
        {children}
      </Box>
    );
  },
);

GridItem.displayName = 'GridItem';

export default GridItem;
