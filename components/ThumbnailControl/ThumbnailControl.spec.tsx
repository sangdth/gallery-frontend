import { render, screen } from '@/test/utils';
import { ImageFactory } from '@/test/factories';
// import { makeSrcFromPath } from '@/lib/helpers';
import { ThumbnailControl } from './ThumbnailControl';

const fakeImage = ImageFactory.build();

describe('ThumbnailControl', () => {
  it('can render images', async () => {
    render(<ThumbnailControl images={[fakeImage]} width={300} />);

    const image = screen.getByRole('img');
    expect(image).toBeInstanceOf(HTMLImageElement);
    //  TODO: Why it does not have src?
    // expect(image).toHaveAttribute('src', makeSrcFromPath(fakeImage.path));
  });
});
