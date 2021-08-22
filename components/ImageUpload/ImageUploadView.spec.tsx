import { render, screen } from '@/test/utils';
import { ImageUpload } from './ImageUpload';

describe('ImageUpload', () => {
  it('can render and see the description text', () => {
    const handleOnUploadFn = jest.fn();
    render(
      <ImageUpload
        collectionId="test-collection-id"
        onUpload={handleOnUploadFn}
      />,
    );
    const text = screen.getByText(/Drop file here, browse does not work/);
    expect(text).toBeInTheDocument();
  });
});
