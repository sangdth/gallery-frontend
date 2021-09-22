import { render, screen } from '@/test/utils';
import { ImageFactory } from '@/test/factories';
import Logo from './Logo';

const fakeImage = ImageFactory.build();

describe('Logo', () => {
  it('can render name', async () => {
    render(
      <Logo name="TestName" />,
    );

    const logoName = screen.getByText('TestName');
    expect(logoName).toBeInstanceOf(HTMLHeadingElement);
  });

  it('can render image', async () => {
    render(
      <Logo
        name="TestName"
        imagePath={fakeImage.path}
      />,
    );

    const logoImage = screen.getByRole('img');
    expect(logoImage).toBeInstanceOf(HTMLImageElement);
  });
});
