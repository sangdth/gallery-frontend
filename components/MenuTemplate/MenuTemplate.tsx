import React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { makeId } from '@/lib/helpers';
import type { MenuOption, OptionValue } from '@/lib/types';
import { MenuTemplateItem } from './MenuTemplateItem';

export type MenuTemplateProps = {
  menu: MenuOption['value'];
  onSelect: (item: OptionValue) => void;
};

export const MenuTemplate = (props: MenuTemplateProps) => {
  const { menu, onSelect } = props;

  const handleOnClick = (item: OptionValue) => {
    onSelect(item);
  };

  return (
    <>
      {menu.map((m) => (
        <Menu key={makeId(m)}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="link"
          >
            {m.label}
          </MenuButton>
          <Portal>
            <MenuList>
              {Array.isArray(m.children) && m.children.map((c) => (
                <MenuTemplateItem
                  key={makeId(c)}
                  value={c}
                  onClick={() => handleOnClick(c)}
                />
              ))}
            </MenuList>
          </Portal>
        </Menu>
      ))} 
    </>
  );
};

export default MenuTemplate;
