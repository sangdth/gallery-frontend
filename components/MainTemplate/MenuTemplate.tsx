import React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { makeId, arrayHasValue } from '@/lib/helpers';
import type { MenuOption, OptionValue } from '@/lib/types';
import { MenuTemplateItem } from './MenuTemplateItem';

export type MenuTemplateProps = {
  menu: MenuOption['value'];
  onSelect: (item: OptionValue) => void;
};

export const MenuTemplate = (props: MenuTemplateProps) => {
  const { menu, onSelect } = props;

  const handleOnClick = (item: OptionValue) => {
    if (!arrayHasValue(item.children)) {
      onSelect(item);
    }
  };

  return (
    <HStack spacing="20px">
      {menu.map((m) => (
        <Menu key={makeId(m)}>
          <MenuButton
            as={Button}
            rightIcon={arrayHasValue(m.children) ? <ChevronDownIcon /> : undefined}
            variant="link"
            onClick={() => handleOnClick(m)}
          >
            {m.label}
          </MenuButton>
          {arrayHasValue(m.children) && (
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
          )}
        </Menu>
      ))} 
    </HStack>
  );
};

export default MenuTemplate;
