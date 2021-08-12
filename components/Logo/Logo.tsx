import React, { useMemo } from 'react';
import { Heading } from '@chakra-ui/react';

type LogoProps = {
  size?: 'huge' | 'default' | 'small';
};

export const Logo = (props: LogoProps) => {
  const { size = 'default'} = props;
  
  const style = useMemo(() => {
    switch (size) {
      case 'huge':
        return {
          width: 'auto',
          height: 'auto',
          size: '4xl',
        };
      case 'small':
        return {
          width: 100,
          height: 'auto',
          size: 'xs',
        };
      default:
        return {
          width: 150,
          height: 36,
          size: 'md',
        };
    }
  }, []);

  return (
    <Heading size={style.size} fontWeight="bold">
      GALLERY
    </Heading>
  );
};

export default Logo;
