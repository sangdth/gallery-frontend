import { render, screen } from '@/test/utils';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import type { OptionValue } from '@/lib/types';
import MenuTemplateItem from './MenuTemplateItem';

const testMenuItemValue: OptionValue = {
  id: '7982f80c-922a-459f-8406-a7fc91ed01ad',
  label: 'Clean house',
  slug: 'clean-house',
};

describe('MenuTemplateItem', () => {
  it('can render with basic value', async () => {
    const onClickFn = jest.fn();

    render(
      <Menu>
        <MenuButton as={Button} variant="link">
          Test MenuTemplateItem
        </MenuButton>
        <MenuList>
          <MenuTemplateItem
            value={testMenuItemValue}
            onClick={onClickFn}
          />
        </MenuList>
      </Menu>,
    );
    
    const label = screen.getByText(/Test MenuTemplateItem/);
    expect(label).toBeInTheDocument();
  });
});
