import '../styles/globals.css';
import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import SuperTokensReact from 'supertokens-auth-react';
import SuperTokensNode from 'supertokens-node';
import Session from 'supertokens-auth-react/recipe/session';
import { redirectToAuth } from 'supertokens-auth-react/recipe/emailpassword';
import type { AppProps } from 'next/app';

import { frontendConfig, backendConfig } from '../config/supertokensConfig';
import { useApollo } from '../lib/apollo';

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig());
} else {
  SuperTokensNode.init(backendConfig());
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    async function doRefresh() {
      if (pageProps.fromSupertokens === 'needs-refresh') {
        if (await Session.attemptRefreshingSession()) {
          location.reload(); // eslint-disable-line no-restricted-globals
        } else {
          redirectToAuth(); // user has been logged out
        }
      }
    }
    doRefresh();
  }, [pageProps.fromSupertokens]);

  const apolloClient = useApollo(pageProps.initialApolloState);

  if (pageProps.fromSupertokens === 'needs-refresh') {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
export default MyApp;
