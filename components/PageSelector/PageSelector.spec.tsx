import { render, screen } from '@/test/utils';
import { PageFactory } from '@/test/factories';
import type { PageType } from '@/lib/types';
import PageSelector from './PageSelector';

const testPlaceholder = 'test placeholder string';
const testPages: PageType[] = PageFactory.buildList(3);

describe('PageSelector', () => {
  // beforeEach(() => {
  //  PageFactory.reset(); // TODO: why does not have reset?
  // });

  it('can render placeholder', () => {
    const onCreateFn = jest.fn();
    const onSelectFn = jest.fn();
    render(
      <PageSelector
        placeholder={testPlaceholder}
        pages={testPages}
        onCreate={onCreateFn}
        onSelect={onSelectFn}
      />,
    );
    
    const placeholder = screen.getByText(testPlaceholder);
    expect(placeholder).toBeInTheDocument();
  });
});
