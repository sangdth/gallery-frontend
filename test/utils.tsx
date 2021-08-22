import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppWrapper } from '../components'; // use this for end to end tests

const AllTheProviders: FC = ({ children }) => {
  return (
    <AppWrapper>
      {children}
    </AppWrapper>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { renderWithProviders };
