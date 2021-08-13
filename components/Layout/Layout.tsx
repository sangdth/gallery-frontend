import React from 'react';
import Head from 'next/head';
import { useAuth } from '@nhost/react-auth';
import { Flex } from '@chakra-ui/react';
import { Navbar } from '../Navbar';
import { NAV_ITEMS } from '../../lib/constants';
import type { SiteType } from '../../lib/types';

export type LayoutProps = {
  children: React.ReactNode;
  site?: SiteType;
};

export const Layout = (props: LayoutProps) => {
  const {
    children,
    site,
  } = props;

  const { signedIn } = useAuth();

  return (
    <>
      <Head>
        <title>{site?.name ?? 'Gallery'}</title>
        <meta name="description" content={site?.description ?? ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column">
        {signedIn && <Navbar items={NAV_ITEMS} />}

        <Flex>{children}</Flex>
      </Flex>
    </>
  );
};

export default Layout;
