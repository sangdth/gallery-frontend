import React from 'react';
import { render, screen } from '@/test/utils';
import LogoOptionSection from './LogoOptionSection';

describe('LogoOptionSection', () => {
  it('renders text', () => {
    render(<LogoOptionSection something="lorem" />);
    expect(screen.getByText('LogoOptionSection')).toBeDefined();
  });
});
