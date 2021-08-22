import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { NhostAuthProvider } from '@nhost/react-auth';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { ChakraProvider } from '@chakra-ui/react';
import { auth } from '@/lib/nhost';
import { GRAPHQL_ENDPOINT } from '@/lib/constants';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <JotaiProvider>
      <NhostAuthProvider auth={auth}>
        <NhostApolloProvider auth={auth} gqlEndpoint={GRAPHQL_ENDPOINT}>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </NhostApolloProvider>
      </NhostAuthProvider>
    </JotaiProvider>
  );
};

export default AppProvider;
