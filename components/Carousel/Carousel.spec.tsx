import { fireEvent, render, screen } from '@/test/utils';
import { ImageFactory } from '@/test/factories';
import { CarouselPlain } from './Carousel';

const totalCount = 10;
const fakeImages = ImageFactory.buildList(totalCount);

describe('Carousel', () => {
  it('can render components', async () => {
    render(
      <CarouselPlain
        images={fakeImages}
        totalCount={totalCount}
      />,
    );

    const nextButton = screen.getByText('〉');
    expect(nextButton).toBeInTheDocument();
  });

  it('fire onPageChange when clicking on next', async () => {
    const onPageChangeFn = jest.fn();

    render(
      <CarouselPlain
        images={fakeImages}
        totalCount={totalCount}
        onPageChange={onPageChangeFn}
      />,
    );

    fireEvent(
      screen.getByText('〉'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onPageChangeFn).toHaveBeenCalledTimes(1);
  });
});
