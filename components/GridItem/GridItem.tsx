import React, { memo } from 'react';
import { Flex } from '@chakra-ui/react';

type GridItemProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isDragged?: boolean;
  onClick?: () => void;
};

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (props, forwardedRef) => {
    const {
      children,
      style,
      className,
      isDragged,
      onClick,
      ...restProps
    } = props;

    const handleOnClick = () => {
      if (typeof onClick === 'function') {
        onClick();
      }
    };

    return (
      <Flex
        as="div"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#FFFFFF"
        borderWidth="1px"
        borderColor="#DDDDDD"
        boxShadow={isDragged ? 'xl' : 'xs'}
        className={className}
        ref={forwardedRef}
        style={style}
        onClick={handleOnClick}
        {...restProps}
      >
        {children}
      </Flex>
    );
  },
);

GridItem.displayName = 'GridItem';

export default memo(GridItem);
