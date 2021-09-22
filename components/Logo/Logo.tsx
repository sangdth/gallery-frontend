import React, { useMemo } from 'react';
import {
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from '@nhost/react-auth';

type LogoProps = {
  imagePath?: string;
  url?: string;
  name: string;
  preview?: boolean;
  size?: 'huge' | 'default' | 'small';
};

const Logo = (props: LogoProps) => {
  const {
    name = 'GALLERY',
    url = '/',
    imagePath,
    preview = false,
    size = 'default',
  } = props;
  const { signedIn } = useAuth();

  const href = signedIn ? '/home' : url;

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
  }, [size]);

  return (
    <LinkBox
      textAlign="center"
      style={{ pointerEvents: preview ? 'none' : 'auto' }}
    >
      <NextLink passHref href={href}>
        <LinkOverlay>
          {imagePath ? (
            <Image src={imagePath} alt={name} /> 
          ) : (
            <Heading size={styles.size} fontWeight="bold">
              {name}
            </Heading>
          )}
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};

export default Logo;
