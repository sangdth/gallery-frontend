import { render, screen } from '@/test/utils';
import { PageFactory, MenuFactory } from '@/test/factories';
import type { MenuOption, PageType } from '@/lib/types';
import { MenuEditorModal } from './MenuEditorModal';

const testPages: PageType[] = PageFactory.buildList(5);
const testMenu: MenuOption = MenuFactory.build();

describe('MenuEditorModal', () => {
  it('can render with basic elements', () => {
    const onSubmitFn = jest.fn();
    const refetchFn = jest.fn();

    render(
      <MenuEditorModal
        pages={testPages}
        menu={testMenu}
        onSubmit={onSubmitFn}
        refetch={refetchFn}
      />,
    );
    
    const title = screen.getByText(/Config Menu/);
    expect(title).toBeInTheDocument();
  });
});
