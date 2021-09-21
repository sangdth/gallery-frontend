import { fireEvent, render, screen } from '@/test/utils';
import { ImageFactory } from '@/test/factories';
// import { makeSrcFromPath } from '@/lib/helpers';
import { ThumbnailControl } from './ThumbnailControl';

const fakeImage = ImageFactory.build();

describe('ThumbnailControl', () => {
  it('can render images', async () => {
    render(
      <ThumbnailControl
        current={null}
        images={[fakeImage]}
        totalCount={10}
        width={300} 
      />,
    );

    const image = screen.getByRole('img');
    expect(image).toBeInstanceOf(HTMLImageElement);
    //  TODO: Why it does not have src?
    // expect(image).toHaveAttribute('src', makeSrcFromPath(fakeImage.path));
  });

  it('can click on image', async () => {
    const onClickThumbnailFn = jest.fn();

    render(
      <ThumbnailControl
        current={null}
        images={[fakeImage]}
        onClickThumbnail={onClickThumbnailFn}
        totalCount={10}
        width={300} 
      />,
    );

    fireEvent(
      screen.getByRole('img'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onClickThumbnailFn).toHaveBeenCalledTimes(1);
  });
});
