import { render, screen } from '@/test/utils';
import { PageFactory } from '@/test/factories';
import type { PageType } from '@/lib/types';
import MainTemplate from './MainTemplate';

const testPage: PageType = PageFactory.build();

describe('MainTemplate', () => {
  it('can render component', async () => {

    render(
      <MainTemplate
        page={testPage}
      />,
    );
    
    const found = screen.getByText(/test page/);
    expect(found).toBeInTheDocument();
  });
});
