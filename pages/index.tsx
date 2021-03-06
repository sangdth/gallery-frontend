import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';
import { Layout, LoadingScreen } from '@/components';
import { useAuth } from '@/lib/hooks';

function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push('/home');
    return <LoadingScreen label="Redirecting to landing page..." />;
  }

  return (
    <>
      <Head>
        <title>Gallery</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Flex direction="column" width="100%" padding="20px">
          This is landing page
        </Flex>
      </Layout>
    </>
  );
}

export default Index;
