import { render, screen } from '../../test/utils';
import { Footer } from './Footer';

describe('Footer', () => {
  it('can render Footer text', () => {
    render(<Footer />);
    const text = screen.getByText(/Footer/);
    expect(text).toBeInTheDocument();
  });
});
