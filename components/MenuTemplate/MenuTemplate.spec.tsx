import { render, screen } from '@/test/utils';
import { MenuTemplate } from './MenuTemplate';

// const testPages: PageType[] = PageFactory.buildList(5);
const testMenuValue = {
  id: '7982f80c-922a-459f-8406-a7fc91ed01ad',
  label: 'Clean house',
  slug: 'clean-house',
};

describe('MenuTemplate', () => {
  it('can render component', async () => {
    const onSelectFn = jest.fn();

    render(
      <MenuTemplate
        menu={[testMenuValue]}
        onSelect={onSelectFn}
      />,
    );
    
    const triggerButton = screen.getByText(/Clean house/);
    expect(triggerButton).toBeInTheDocument();
  });
});
