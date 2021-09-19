import React from 'react';
import { render, screen } from '@/test/utils';
import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
  it('renders text', () => {
    render(<LoadingScreen something="lorem" />);
    expect(screen.getByText('LoadingScreen')).toBeDefined();
  });
});
