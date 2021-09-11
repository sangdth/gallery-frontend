import { render, screen } from '@/test/utils';
import { ImageFactory } from '@/test/factories';
// import { makeSrcFromPath } from '@/lib/helpers';
import { Carousel } from './Carousel';

const fakeImage = ImageFactory.build();

describe('Carousel', () => {
  it('can render images', async () => {
    render(<Carousel images={[fakeImage]} width={600} />);

    const image = screen.getByRole('img');
    expect(image).toBeInstanceOf(HTMLImageElement);
    //  TODO: Why it does not have src?
    // expect(image).toHaveAttribute('src', makeSrcFromPath(fakeImage.path));
  });
});
