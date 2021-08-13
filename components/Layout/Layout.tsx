import React from 'react';
import Head from 'next/head';
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

  return (
    <>
      <Head>
        <title>{site?.name ?? 'Gallery'}</title>
        <meta name="description" content={site?.description ?? ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column">
        {!site && <Navbar items={NAV_ITEMS} />}

        <Flex>{children}</Flex>
      </Flex>
    </>
  );
};

export default Layout;
