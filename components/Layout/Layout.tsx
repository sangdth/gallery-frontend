import React from 'react';
import Head from 'next/head';
import { Flex } from '@chakra-ui/react';
import { ErrorBoundary, Navbar } from '@/components';
import { NAV_ITEMS } from '@/lib/constants';
import type { SiteType } from '@/lib/types';

export type LayoutProps = {
  children: React.ReactNode;
  site?: SiteType;
};

const Layout = (props: LayoutProps) => {
  const {
    children,
    site,
  } = props;

  return (
    <ErrorBoundary>
      <Head>
        <title>{site?.name ?? 'Gallery'}</title>
        <meta name="description" content={site?.description ?? ''} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column" width="100%" height="100%">
        {!site && <Navbar items={NAV_ITEMS} />}

        <Flex>{children}</Flex>
      </Flex>
    </ErrorBoundary>
  );
};

export default Layout;
