import { Stack, useColorModeValue } from '@chakra-ui/react';
import MobileNavItem from './MobileNavItem';
import type { NavItem } from '@/lib/types';

type Props = {
  items: NavItem[];
};

export const MobileNav = ({ items }: Props) => (
  <Stack
    bg={useColorModeValue('white', 'gray.800')}
    p={4}
    display={{ md: 'none' }}
  >
    {items.map((navItem) => (
      <MobileNavItem key={navItem.label} {...navItem} />
    ))}
  </Stack>
);

export default MobileNav;
