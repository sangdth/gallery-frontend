import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ErrorBoundary } from '@/components';
import { makeId, arrayHasValue } from '@/lib/helpers';
import type { MenuOption, OptionValue } from '@/lib/types';
import { MenuTemplateItem } from './MenuTemplateItem';

export type MenuTemplateProps = {
  menu: MenuOption['value'];
  onSelect: (items: OptionValue[]) => void;
};

export const MenuTemplate = (props: MenuTemplateProps) => {
  const { menu, onSelect } = props;
  const [items, setItems] = useState<OptionValue[]>([]);

  const handleOnClick = (item: OptionValue) => {
    // Be careful when working with recursive
    // It needs to send array of items because we want to calculate path
    const newItems = [...items];
    newItems.push(item);

    if (!arrayHasValue(item.children)) {
      onSelect(newItems);
    }

    setItems(newItems);
  };
  
  return (
    <ErrorBoundary>
      <HStack spacing="20px">
        {menu.map((m) => (
          <Menu key={makeId(m)} onClose={() => setItems([])}>
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
    </ErrorBoundary>
  );
};

export default MenuTemplate;
