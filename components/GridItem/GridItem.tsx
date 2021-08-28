import React, { memo, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';

type GridItemProps = {
  editable?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isDragged?: boolean;
  onClick?: () => void;
};

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (props, forwardedRef) => {
    const {
      editable = false,
      children,
      style,
      className,
      isDragged,
      onClick,
      ...restProps
    } = props;

    const checkBoxShadow = useMemo(() => {
      if (editable) {
        return isDragged ? 'xl' : 'xs';
      }
      return undefined;
    }, [editable, isDragged]);

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
        borderWidth={`${editable ? 1 : 0}px`}
        borderColor={editable ? '#DDDDDD' : undefined}
        boxShadow={checkBoxShadow}
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
