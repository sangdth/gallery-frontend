import React from 'react';
import { render, screen } from '@/test/utils';
import { DomainOptionSection } from './DomainOptionSection';

describe('DomainOptionSection', () => {
  it('renders without error', () => {
    render(<DomainOptionSection />);
    const input = screen.queryByPlaceholderText(/example.com/i);
    expect(input).toBeDefined();
  });
});
