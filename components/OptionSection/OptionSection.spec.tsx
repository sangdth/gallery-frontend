import React from 'react';
import { render, screen } from '@/test/utils';
import OptionSection from './OptionSection';

describe('OptionSection', () => {
  it('renders text', () => {
    render(<OptionSection something="lorem" />);
    expect(screen.getByText('OptionSection')).toBeDefined();
  });
});
