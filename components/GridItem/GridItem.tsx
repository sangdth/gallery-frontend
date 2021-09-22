import React, { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';

type GridItemProps = {
  editable?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isDragged?: boolean;
  onClick?: () => void;
};

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
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
        alignItems="start"
        backgroundColor="#FFFFFF"
        borderColor={editable ? '#DDDDDD' : undefined}
        borderWidth={`${editable ? 1 : 0}px`}
        boxShadow={checkBoxShadow}
        className={className}
        onClick={handleOnClick}
        ref={forwardedRef}
        style={style}
        {...restProps}
      >
        {children}
      </Flex>
    );
  },
);
GridItem.displayName = 'GridItem';

export default GridItem;
