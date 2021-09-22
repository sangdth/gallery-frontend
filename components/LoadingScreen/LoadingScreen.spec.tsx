import React from 'react';
import { render, screen } from '@/test/utils';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
  it('renders text', () => {
    render(<LoadingScreen label="loadingisloading" />);
    const labels = screen.getAllByText('loadingisloading');
    expect(labels).toBeDefined();
  });
});
