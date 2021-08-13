import React, { useMemo } from 'react';
import {
  Heading,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from '@nhost/react-auth';

type LogoProps = {
  size?: 'huge' | 'default' | 'small';
};

export const Logo = (props: LogoProps) => {
  const { size = 'default'} = props;
    const { signedIn } = useAuth();
  
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
    <LinkBox>
      <NextLink href={signedIn ? '/home' : '/'} passHref>
        <LinkOverlay>
          <Heading size={style.size} fontWeight="bold">
            GALLERY
          </Heading>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};

export default Logo;
