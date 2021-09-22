import { render, fireEvent, screen } from '@/test/utils';
import { PageFactory, MenuFactory } from '@/test/factories';
import type { MenuOption, PageType } from '@/lib/types';
import MenuEditorModal from './MenuEditorModal';

const testPages: PageType[] = PageFactory.buildList(5);
const testMenu: MenuOption = MenuFactory.build();

describe('MenuEditorModal', () => {
  it('can render with basic elements', async () => {
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
    
    const triggerButton = screen.getByRole('button');
    expect(triggerButton).toBeInTheDocument();

    fireEvent.click(triggerButton);
    const saveButton = await screen.findByText(/Save Menu/);
    expect(saveButton).toBeInTheDocument();
  });
});
