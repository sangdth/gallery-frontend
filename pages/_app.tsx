import '../styles/globals.css';
import { Provider as JotaiProvider } from "jotai";
import { NhostAuthProvider } from '@nhost/react-auth';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { auth } from '../lib/nhost';
import { GRAPHQL_ENDPOINT } from '../lib/constants';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <NhostAuthProvider auth={auth}>
        <NhostApolloProvider auth={auth} gqlEndpoint={GRAPHQL_ENDPOINT}>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </NhostApolloProvider>
      </NhostAuthProvider>
    </JotaiProvider>
  );
}
export default MyApp;
