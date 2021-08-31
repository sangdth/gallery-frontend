import { render } from '@/test/utils';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('can render component', async () => {

    render(<Carousel images={[]} />);
    // const found = screen.getByText(/test page/);
    // expect(found).toBeInTheDocument();
  });
});
