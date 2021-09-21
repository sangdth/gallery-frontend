import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AppWrapper } from '@/components'; // TODO: use this for end to end tests

// TODO: Replace real providers with mocked
const AllTheProviders: FC = ({ children }) => {
  return (
    <AppWrapper>
      {children}
    </AppWrapper>
  );
};
const renderWithAllProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

const mocks: any[] = [
  {
    request: {
      query: 'sadf',
    },
    result: {
      data: {
        pokemons: [
          {
            id: 1,
            number: 1,
            name: 'Pikatchu',
          }],
      },
    },
  },
];
const MockedApolloProvider: FC = ({ children }) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
};
const renderWithMockedProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: MockedApolloProvider, ...options });

export * from '@testing-library/react';
export { renderWithAllProviders };
export { renderWithMockedProvider };
