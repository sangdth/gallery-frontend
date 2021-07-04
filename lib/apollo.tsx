/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires, global-require */
import React, { useMemo } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { IncomingMessage, ServerResponse } from 'http';
import { NextPage } from 'next';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface GraphQlContext {
  req?: NextApiRequest | IncomingMessage;
  res?: NextApiResponse | ServerResponse;
}

const isServer = typeof window === 'undefined';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * TODO: SSG and SSR
 */
const token = ''; // TODO: make jwt from SuperTokens
const httpLink = createHttpLink({
  credentials: 'same-origin',
  fetch, // Use fetch polyfill
  uri: process.env.HASURA_GRAPHQL_ENDPOINT || '',
  headers: {
    Authorization: `Bearer ${token}`,
    'x-hasura-role': token ? 'admin' : 'guest', // can not miss this mother fucker
  },
});

function createApolloClient(): ApolloClient<any> {
  return new ApolloClient({
    ssrMode: isServer,
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  // context?: GraphQlContext,
): ApolloClient<any> {
  const client = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    client.cache.restore(initialState);
  }

  /**
   * SSG and SSR
   * Always create a new Apollo Client
   */
  if (isServer) {
    return client;
  }

  // Create the Apollo Client once in the client
  apolloClient = apolloClient ?? client;

  return client;
}

export const getApolloClient = initializeApollo;

export function useApollo(initialState: any) {
  const apolloStore = useMemo(() => initializeApollo(initialState), [
    initialState,
  ]);
  return apolloStore;
}

export const withApollo = (Comp: NextPage) => ({ apolloState }: { apolloState: any }) => {
  const apolloStore = useApollo(apolloState);
  return (
    <ApolloProvider client={apolloStore}>
      <Comp />
    </ApolloProvider>
  );
};
