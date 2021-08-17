import React, { useMemo } from 'react';
import {
  Heading,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from '@nhost/react-auth';

type LogoProps = {
  preview?: boolean;
  style?: any;
  size?: 'huge' | 'default' | 'small';
};

export const Logo = (props: LogoProps) => {
  const {
    preview = false,
    size = 'default',
    style,
  } = props;
  const { signedIn } = useAuth();

  const href = signedIn ? '/home' : '/';

  const styles = useMemo(() => {
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
    <div style={style}>
      <LinkBox textAlign="center">
        <NextLink href={preview ? '' : href} passHref>
          <LinkOverlay>
            <Heading size={styles.size} fontWeight="bold">
              GALLERY
            </Heading>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </div>
  );
};

export default Logo;
