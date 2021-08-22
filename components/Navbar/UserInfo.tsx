import React from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ChevronDownIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { meAtom } from '@/lib/jotai';
import { auth } from '@/lib/nhost';

export const UserInfo = () => {
  const router = useRouter();
  const [me] = useAtom(meAtom);

  const handleSettings = async () => router.push('/settings');

  const handleLogout = async () => {
    await auth.logout();

    return router.push('/login');
  };

  return (
    <Menu>
      <MenuButton
        p={2}
        transition="all 0.2s"
        borderRadius="md"
        _hover={{ bg: 'gray.100' }}
        _expanded={{ bg: 'gray.200' }}
      >
        <HStack alignItems="center" spacing="10px">
          <Avatar
            size="sm"
            name={me?.display_name ?? ''}
            src={me?.avatar_url ?? ''}
          />
          <Box>{me?.display_name}</Box>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<SettingsIcon />} onClick={handleSettings}>
          Settings
        </MenuItem>

        <MenuDivider />

        <MenuItem icon={<ArrowBackIcon />} onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserInfo;
