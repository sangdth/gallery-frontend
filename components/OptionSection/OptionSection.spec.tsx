import React from 'react';
import { render, screen } from '@/test/utils';
import OptionSection from './OptionSection';

describe('OptionSection', () => {
  it('renders text', () => {
    const Child = () => <>something</>;

    render(
      <OptionSection title="Lorem">
        <Child />
      </OptionSection>,
    );
    expect(screen.getByText('Lorem')).toBeDefined();
  });
});
