import '../styles/globals.css';
import { NhostAuthProvider } from '@nhost/react-auth';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { auth } from '../lib/nhost';
import { GRAPHQL_ENDPOINT } from '../lib/constants';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NhostAuthProvider auth={auth}>
      <NhostApolloProvider auth={auth} gqlEndpoint={GRAPHQL_ENDPOINT}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </NhostApolloProvider>
    </NhostAuthProvider>
  );
}
export default MyApp;
