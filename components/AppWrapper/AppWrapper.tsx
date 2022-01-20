import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { NhostAuthProvider } from '@nhost/react-auth';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary } from '@/components';
import { nhost } from '@/lib/nhost';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <JotaiProvider>
      <NhostAuthProvider nhost={nhost}>
        <NhostApolloProvider nhost={nhost}>
          <ChakraProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ChakraProvider>
        </NhostApolloProvider>
      </NhostAuthProvider>
    </JotaiProvider>
  );
};

export default AppProvider;
