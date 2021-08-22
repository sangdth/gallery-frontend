import { render, screen } from '@/test/utils';
import { Ruler } from './Ruler';

describe('Ruler', () => {
  it('can render correct width number', () => {
    const value = 1234;

    render(<Ruler value={value} />);
    
    const widthValueWithPixel = screen.getByText(`${value}px`);
    expect(widthValueWithPixel).toBeInTheDocument();
  });
});
