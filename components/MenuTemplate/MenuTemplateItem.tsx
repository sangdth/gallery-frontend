import React from 'react';
import { MenuItem } from '@chakra-ui/react';
import type { OptionValue } from '@/lib/types';

export type MenuTemplateItemProps = {
  value: OptionValue;
  onClick: (item: OptionValue) => void;
};

export const MenuTemplateItem = (props: MenuTemplateItemProps) => {
  const { value, onClick } = props;
  
  return (
    <MenuItem
      key={`${value.id}-${value.slug}`}
      onClick={() => onClick(value)}
    >
      {value.label}
    </MenuItem>
  );
};

export default MenuTemplateItem;
