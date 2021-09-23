import { render, screen } from '@/test/utils';
import { DRAGDROP_DESCRIPTION } from '@/lib/constants';
import ImageUpload from './ImageUpload';

describe('ImageUpload', () => {
  it('can render and see the description text', () => {
    const handleOnUploadFn = jest.fn();
    render(
      <ImageUpload
        collectionId="test-collection-id"
        onUpload={handleOnUploadFn}
      />,
    );
    const text = screen.getByText(DRAGDROP_DESCRIPTION);
    expect(text).toBeInTheDocument();
  });
});
